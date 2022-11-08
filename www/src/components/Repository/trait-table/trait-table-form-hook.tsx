import { Popover, Transition } from '@headlessui/react'
import {
  CheckCircleIcon,
  InformationCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  MinusIcon,
  PlusCircleIcon,
  PlusIcon,
  RefreshIcon,
  XCircleIcon,
} from '@heroicons/react/outline'
import { TraitElement } from '@prisma/client'
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { getImageForTrait } from '@utils/image'
import { sumBy, sumByBig } from '@utils/object-utils'
import Big from 'big.js'
import clsx from 'clsx'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { FieldArrayWithId, useForm } from 'react-hook-form'
import { env } from 'src/env/client.mjs'
import { useMutateRenameTraitElement } from './trait-rename-mutate-hook'

export type TraitElementFormType = {
  traitElements: {
    checked: boolean
    locked: boolean
    weight: Big
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    layerElementId: string
  }[]
  allCheckboxesChecked: boolean
}

/** Note, we use big.js's Big to ensure precision. Javascript just sux tbh. */
const WEIGHT_STEP_COUNT = Big(1)
const WEIGHT_LOWER_BOUNDARY = Big(0)
const WEIGHT_UPPER_BOUNDARY = Big(100)

/**
 * This hook handles all the core logic for the TraitElement table form.
 */
export const useTraitElementForm = ({
  traitElements,
  repositoryId,
  key,
  searchFilter = '',
}: {
  traitElements: TraitElement[]
  repositoryId: string
  key: string
  searchFilter?: string
}) => {
  const [hasFormChange, setHasFormChange] = useState<boolean>(false)
  const [isDeleteClicked, setIsDeletedClicked] = useState<boolean>(false)
  const [isCreateClicked, setIsCreateClicked] = useState<boolean>(false)
  const initialSum = useMemo(() => sumBy(traitElements, (x) => x.weight), [key])
  const changeTimer: React.MutableRefObject<NodeJS.Timer | null> = React.useRef(null)

  /**
   *  Note, only rename is mutate here because of the in-place mutate nature of renaming.
   */
  const { mutate } = useMutateRenameTraitElement()

  /**
   * Table data based on react-hook-form
   * Handles default values in the table, and any hooks needed for the table.
   * Use the default value to add more functionality into the form.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm<TraitElementFormType>({
    defaultValues: {
      allCheckboxesChecked: false,
      traitElements: [...traitElements].map((x) => ({ ...x, checked: false, locked: false, weight: Big(x.weight) })),
    },
  })

  /**
   * This is use the reset the rarity button's increment/decement interval reference.
   */
  const resetRarityInterval = () => {
    if (!changeTimer.current) return
    clearInterval(changeTimer.current)
    changeTimer.current = null
  }

  /**
   * Checks if its possible to still distribute
   */
  const isIncreaseRarityPossible = (index: number) => {
    const weight = getValues(`traitElements.${index}.weight`)
    const locked = getValues(`traitElements.${index}.locked`)

    // checks the max boundary
    const maxCheck = Big(weight).eq(WEIGHT_UPPER_BOUNDARY)

    // checks the None trait can be distribute to if locked
    const lockCheck = locked && Big(getValues(`traitElements.${0}.weight`)).eq(WEIGHT_LOWER_BOUNDARY)

    return lockCheck || maxCheck
  }

  /**
   * This is used to create an interval for the rarity button's increment/decement.
   * Note, we use an interval to ensure that user can hold down the button to increment/decrement.
   */
  const decrementRarityInterval = (index: number) => {
    if (changeTimer.current) return
    changeTimer.current = setInterval(() => {
      /** Get latest values for the form */
      const weight = Big(getValues(`traitElements.${index}.weight`))
      const locked = getValues(`traitElements.${index}.locked`)
      const id = getValues(`traitElements.${index}.id`)

      /** If has reached lower boundary 0, return */
      if (weight.eq(0)) return

      /** Figure out how much to change */
      let weightToChange = WEIGHT_STEP_COUNT
      if (weight.minus(weightToChange).lt(WEIGHT_LOWER_BOUNDARY)) {
        weightToChange = new Big(weight)
      }

      setValue(`traitElements.${index}.weight`, weight.minus(weightToChange))
      setHasFormChange(true)

      /** If locked then dont distribute linearly */
      if (locked) return

      /** Distribute linearly */
      const linear = weightToChange.div(
        getValues().traitElements.length - 1 - getValues().traitElements.filter((x) => x.locked).length
      )
      getValues().traitElements.forEach((x, index) => {
        if (x.id === id) return
        if (x.locked) return
        const w = Big(x.weight)
        if (w.minus(linear).lt(WEIGHT_LOWER_BOUNDARY)) return
        setValue(`traitElements.${index}.weight`, w.plus(linear))
      })
    }, 50)
  }

  const incrementRarityInterval = (index: number) => {
    if (changeTimer.current) return
    changeTimer.current = setInterval(() => {
      /** Get latest values for the form */
      const weight = Big(getValues(`traitElements.${index}.weight`))
      const locked = getValues(`traitElements.${index}.locked`)
      const id = getValues(`traitElements.${index}.id`)

      /** Get max the rarity can grow to */
      const max = locked
        ? WEIGHT_UPPER_BOUNDARY.minus(
            sumByBig(
              getValues().traitElements.filter((_, i) => !(i === 0 || i === index)),
              (x) => x.weight
            )
          )
        : WEIGHT_UPPER_BOUNDARY

      /** If has reached lower boundary 0, return */
      if (weight.eq(0)) return

      /** Figure out how much to change */
      let weightToChange = WEIGHT_STEP_COUNT
      if (weight.plus(weightToChange).gt(max)) {
        weightToChange = new Big(max).minus(weight)
      }

      setValue(`traitElements.${index}.weight`, weight.plus(weightToChange))
      setHasFormChange(true)

      /** If locked then dont distribute linearly, only to none trait */
      if (locked) {
        setValue(`traitElements.${0}.weight`, Big(getValues(`traitElements.${0}.weight`)).minus(weightToChange))
        return
      }

      /** Distribute linearly */
      const linearDistributeCount = getValues().traitElements.filter((x) => x.locked).length
      const nonLinearDistributeCount = getValues().traitElements.length - linearDistributeCount
      const linearDistribute = weightToChange.div(nonLinearDistributeCount - 1)

      getValues().traitElements.forEach((x, index) => {
        if (x.id === id) return
        if (x.locked) return
        const w = Big(x.weight)
        if (w.plus(linearDistribute).lt(WEIGHT_LOWER_BOUNDARY)) return
        setValue(`traitElements.${index}.weight`, w.minus(linearDistribute))
      })
    }, 50)
  }

  /**
   * This effect ensures that when App is unmounted we should the interval
   */
  useEffect(() => {
    return () => resetRarityInterval()
  }, [])

  /**
   * Used in effects.
   * Source: https://react-hook-form.com/api/useform/watch
   */
  const traitElementsArray = watch('traitElements')
  const allCheckboxesChecked = watch('allCheckboxesChecked')

  /**
   * Used to check if the trait is a none trait. These traits are not allowed to be deleted, renamed, etc.
   */
  const isNoneTraitElement = (id: string) => {
    return id === 'none'
  }

  /**
   * Reset Effect
   * This effect resets the Table.
   */
  useEffect(() => {
    setValue('allCheckboxesChecked', false)
    setHasFormChange(false)
    // setInitialSum(sumBy(traitElements, (x) => x.weight))
    reset({ traitElements: traitElements.map((x) => ({ ...x, checked: false, locked: false })) })
  }, [key])

  /**
   * Delete All Checkbox Effect
   * This effect allows the ability to force set all delete checkboxes to be clicked
   * based on the TableHeader checkbox.
   */
  useEffect(() => {
    traitElementsArray.forEach((x, index) => {
      /**
       * Skip none trait. Cannot be deleted.
       * @todo Is there a better method to handle this? Can we have a variable in db called deletable?
       */
      if (isNoneTraitElement(x.id)) {
        return
      }

      setValue(`traitElements.${index}.checked`, allCheckboxesChecked)
    })
  }, [allCheckboxesChecked])

  const columns = useMemo<ColumnDef<FieldArrayWithId<TraitElementFormType, 'traitElements', 'id'>>[]>(
    () => [
      {
        header: () => (
          <input
            key={key} // @todo reintroduce?
            type='checkbox'
            {...register(`allCheckboxesChecked`)}
            className={clsx(
              'border border-mediumGrey',
              'text-xs rounded-[5px]',
              'focus:outline-none focus:ring-blueHighlight',
              'invalid:border-redError invalid:text-redError',
              'focus:invalid:border-redError focus:invalid:ring-redError'
            )}
          />
        ),
        accessorKey: 'select',
        cell: ({
          row: {
            original: { id },
            index,
          },
        }) => (
          <>
            {!isNoneTraitElement(id) && (
              <input
                key={id}
                type='checkbox'
                value={id}
                {...register(`traitElements.${index}.checked`)}
                className={clsx(
                  'border border-mediumGrey',
                  'text-xs rounded-[5px]',
                  'focus:outline-none focus:ring-blueHighlight',
                  'invalid:border-redError invalid:text-redError',
                  'focus:invalid:border-redError focus:invalid:ring-redError'
                )}
              />
            )}
          </>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: () => <span></span>,
        accessorKey: 'imageUrl',
        cell: ({
          row: {
            original: { id: t, layerElementId: l },
          },
        }) => (
          <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center px-1'>
            <div className='rounded-[5px] border border-mediumGrey'>
              {!isNoneTraitElement(t) && (
                <img
                  className='w-full h-full rounded-[5px]'
                  src={getImageForTrait({
                    r: repositoryId,
                    l,
                    t,
                  })}
                />
              )}
            </div>
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: () => <span>Name</span>,
        accessorKey: 'name',
        cell: ({
          row: {
            original: { id, name },
            index,
          },
        }) => (
          <>
            <div>{errors.traitElements && errors.traitElements[index]?.name?.message}</div>
            {!isNoneTraitElement(id) ? (
              <input
                placeholder={name}
                {...register(`traitElements.${index}.name`)}
                className='px-2 py-1 border border-mediumGrey rounded-[5px] text-xs'
                onBlur={(e) => {
                  e.preventDefault()
                  const newName = String(e.target.value)
                  // if (newValue === name) return
                  mutate({
                    traitElements: [
                      {
                        traitElementId: id,
                        name: newName,
                        repositoryId,
                      },
                    ],
                  })
                }}
              />
            ) : (
              <div className='flex space-x-1 items-center'>
                <span>None</span>
                <Popover>
                  <Popover.Button as={InformationCircleIcon} className='text-darkGrey w-3 h-3 bg-lightGray' />
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-200'
                    enterFrom='opacity-0 translate-y-1'
                    enterTo='opacity-100 translate-y-0'
                    leave='transition ease-in duration-150'
                    leaveFrom='opacity-100 translate-y-0'
                    leaveTo='opacity-0 translate-y-1'
                  >
                    <Popover.Panel className='absolute w-[200px] bg-black z-10 -translate-x-1/2 transform rounded-[5px]'>
                      <div className='p-2 shadow-lg'>
                        <p className='text-[0.65rem] text-white font-normal whitespace-pre-wrap normal-case'>
                          This trait can be used for situations where you don't want to assign a trait to a layer. It cannot be
                          renamed or deleted.
                        </p>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              </div>
            )}
          </>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: () => (
          <div className='flex space-x-1 w-3/4 justify-center items-center'>
            <span>Rarity Percentage</span>
            <Popover>
              <Popover.Button as={InformationCircleIcon} className='text-darkGrey w-3 h-3 bg-lightGray' />
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel className='absolute w-[200px] bg-black z-10 -translate-x-1/2 transform rounded-[5px]'>
                  <div className='p-2 shadow-lg'>
                    <p className='text-[0.65rem] text-white font-normal normal-case'>
                      This is the percentage rarity across all collections that this project has.
                    </p>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
        ),
        accessorKey: 'rarityPercentage',
        cell: ({ row: { original, index } }) => (
          <div className='w-3/4 justify-between flex items-center border border-mediumGrey rounded-[5px]'>
            <button
              // disabled={!!Big(original.weight).eq(WEIGHT_LOWER_BOUNDARY)}
              className='border-r border-mediumGrey px-2 py-2 disabled:cursor-not-allowed'
              onMouseDown={(e) => decrementRarityInterval(index)}
              onMouseUp={resetRarityInterval}
              onMouseLeave={resetRarityInterval}
              type='button'
            >
              <MinusIcon className='w-2 h-2 text-darkGrey' />
            </button>
            <div className='w-full flex items-center justify-between py-1 text-xs px-2'>
              <button
                disabled={isNoneTraitElement(original.id)}
                onClick={(e) => {
                  e.preventDefault()
                  if (original.locked) {
                    setValue(`traitElements.${index}.locked`, false)
                  } else {
                    setValue(`traitElements.${index}.locked`, true)
                  }
                }}
                className='text-darkGrey text-[0.6rem] disabled:cursor-not-allowed'
              >
                {original.locked ? (
                  <LockClosedIcon className='w-3 h-3 text-blueHighlight' />
                ) : (
                  <LockOpenIcon className='w-3 h-3 text-darkGrey' />
                )}
              </button>
              <span className='pl-2 w-full whitespace-nowrap overflow-hidden text-ellipsis flex justify-between cursor-default'>
                {`${new Big(original.weight)
                  .abs()
                  // .div(sumByBig(watch(`traitElements`), (x) => x.weight))
                  // .mul(100)
                  .toFixed(4)}`}
                <span>%</span>
              </span>
            </div>
            <button
              disabled={isIncreaseRarityPossible(index)}
              // disabled={!!Big(original.weight).eq(WEIGHT_UPPER_BOUNDARY)}
              className='border-l border-mediumGrey p-2 disabled:cursor-not-allowed'
              onMouseDown={(e) => {
                incrementRarityInterval(index)
              }}
              onMouseUp={resetRarityInterval}
              onMouseLeave={resetRarityInterval}
              type='button'
            >
              <PlusIcon className='w-2 h-2 text-darkGrey' />
            </button>
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: () => (
          <div className='flex space-x-1'>
            <span>Rarity Score</span>
            <Popover>
              <Popover.Button as={InformationCircleIcon} className='text-darkGrey w-3 h-3 bg-lightGray' />
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel className='absolute w-[200px] bg-black z-10 -translate-x-1/2 transform rounded-[5px]'>
                  <div className='p-2 shadow-lg'>
                    <p className='text-[0.65rem] text-white normal-case'>
                      {'This is the rarity score of each trait in this layer. It is based on the OpenRarity standard.'}
                    </p>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
        ),
        accessorKey: 'rarityScore',
        cell: ({ row: { original } }) => (
          <span>
            {Number(
              -Math.log(new Big(original.weight).div(sumByBig(watch(`traitElements`), (x) => x.weight)).toNumber()).toFixed(3)
            ) % Infinity || 0}
          </span>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: () => (
          <div className='relative'>
            <Popover className='relative flex space-x-1'>
              <Popover.Button className='group inline-flex items-center rounded-[5px] text-xs'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-4 h-4 text-darkGrey'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                  />
                </svg>
                {hasFormChange && (
                  <span className='absolute left-[-20px] top-[-2.5px] px-2 bg-blueHighlight text-white inline-flex items-center rounded-full border border-mediumGrey text-[0.65rem] font-medium'>
                    1
                  </span>
                )}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel className='absolute z-10 py-6 max-w-xs'>
                  <div className='overflow-hidden rounded-[5px] bg-white shadow-md ring-1 ring-black ring-opacity-5 divide-y divide-mediumGrey'>
                    {[
                      {
                        name: 'Add',
                        icon: <PlusCircleIcon className='w-4 h-4' />,
                        onClick: () => {
                          setIsCreateClicked(true)
                        },
                        disabled: false,
                      },
                      {
                        name: 'Save',
                        icon: <CheckCircleIcon className='w-4 h-4' />,
                        onClick: () => {
                          handleSubmit((values) => {
                            console.log(values)
                          })
                        },
                        disabled: !hasFormChange,
                      },
                      {
                        name: 'Reset',
                        icon: <RefreshIcon className='w-4 h-4' />,
                        onClick: () => {
                          reset()
                          setHasFormChange(false)
                        },
                        disabled: !hasFormChange,
                      },
                      {
                        name: 'Delete',
                        icon: <XCircleIcon className='w-4 h-4' />,
                        onClick: () => setIsDeletedClicked(true),
                        // disabled: !(traitElementsArray.filter((x) => x.checked).length > 0),
                      },
                    ].map(({ disabled, name, icon, onClick }) => (
                      <button
                        disabled={disabled}
                        className='relative items-center p-2 flex space-x-1 disabled:cursor-not-allowed disabled:bg-lightGray disabled:text-mediumGrey text-black'
                        onClick={(e) => {
                          e.preventDefault()
                          onClick && onClick()
                        }}
                      >
                        {icon}
                        <span className='text-xs'>{name}</span>
                      </button>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
        ),
        accessorKey: 'actions',
        footer: (props) => props.column.id,
        cell: ({ row: { original, index } }) =>
          !isNoneTraitElement(original.id) && (
            <div className='relative'>
              <Popover className='relative flex space-x-1'>
                <Popover.Button className='group inline-flex items-center rounded-[5px] text-xs'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4 text-darkGrey'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                    />
                  </svg>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-200'
                  enterFrom='opacity-0 translate-y-1'
                  enterTo='opacity-100 translate-y-0'
                  leave='transition ease-in duration-150'
                  leaveFrom='opacity-100 translate-y-0'
                  leaveTo='opacity-0 translate-y-1'
                >
                  <Popover.Panel className='absolute z-10 -translate-y-1/4 left-1/2 max-w-xs'>
                    <div className='overflow-hidden bg-white rounded-[5px] shadow-md ring-1 ring-black ring-opacity-5 divide-y divide-mediumGrey'>
                      {[
                        {
                          name: 'TBD',
                          icon: <XCircleIcon className='w-4 h-4 text-redDot' />,
                          onClick: () => {
                            // setIsDelFeteDialogOpen(true)
                          },
                        },
                      ].map(({ name, icon, onClick }) => (
                        <>
                          <button
                            key={index}
                            className='relative items-center p-2 flex space-x-1 disabled:cursor-not-allowed'
                            onClick={(e) => {
                              e.preventDefault()
                              onClick && onClick()
                            }}
                          >
                            {icon}
                            <span className='text-xs'>{name}</span>
                          </button>
                        </>
                      ))}
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </div>
          ),
      },
    ],
    [hasFormChange]
  )

  const table = useReactTable({
    data: traitElementsArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: env.NEXT_PUBLIC_NODE_ENV === 'production' ? false : true,
  })

  return {
    table,
    delete: { open: isDeleteClicked, set: setIsDeletedClicked },
    create: { open: isCreateClicked, set: setIsCreateClicked },
    getFilteredTraitElements: () => traitElementsArray.filter((x) => x.name.toLowerCase().includes(searchFilter.toLowerCase())),
    getCheckedTraitElements: () => traitElementsArray.filter((x) => x.checked),
  }
}
