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
import { sumByBig } from '@utils/object-utils'
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
    const traitElements = getValues().traitElements
    const weight = Big(getValues(`traitElements.${index}.weight`))
    const none = Big(getValues(`traitElements.${0}.weight`))
    const locked = getValues(`traitElements.${index}.locked`)

    // checks the max boundary
    const maxCheck = weight.eq(WEIGHT_UPPER_BOUNDARY)

    // checks the None trait can be distribute to if locked
    const lockCheck = locked && none.eq(WEIGHT_LOWER_BOUNDARY)

    // checks if there is there is leftover weight to consume
    const leftoverCheck = Big(
      sumByBig(
        traitElements.filter((x) => !x.locked).filter((_, i) => i !== index),
        (x) => x.weight
      )
    ).lte(0)

    return lockCheck || maxCheck || leftoverCheck
  }

  const getMaxGrowthAllowance = (index: number, locked: boolean): Big => {
    return Big(
      locked
        ? WEIGHT_UPPER_BOUNDARY.minus(
            sumByBig(
              getValues().traitElements.filter((_, i) => !(i === 0 || i === index)),
              (x) => x.weight
            )
          )
        : WEIGHT_UPPER_BOUNDARY
    )
  }

  const isEqual = (a: Big, b: Big) => {
    return a.eq(b)
  }

  const getAllowableGrowth = (weight: Big, max: Big): Big => {
    /** Figure out how much to change */
    let weightToChange = WEIGHT_STEP_COUNT
    if (weight.plus(weightToChange).gt(max)) {
      weightToChange = max.minus(weight)
    }
    return weightToChange
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

  const incrementRarityByIndex = (index: number) => {
    /** Get latest values for the form */
    const weight = Big(getValues(`traitElements.${index}.weight`))
    const locked = getValues(`traitElements.${index}.locked`)
    const id = getValues(`traitElements.${index}.id`)
    const traitElements = getValues().traitElements
    const alterableTraitElements = traitElements
      .filter((x) => x.id !== id) // remove the current trait element
      .filter((x) => !x.locked) // remove the locked trait elements
      .filter((x) => !Big(x.weight).eq(WEIGHT_LOWER_BOUNDARY)) // remove the trait elements that has reached lower boundary

    /** Get max the rarity can grow to */
    const max = getMaxGrowthAllowance(index, locked)

    /** If has reached upper boundary max, return */
    if (isEqual(weight, max)) return

    /** Figure out how much to change */
    const growth = getAllowableGrowth(weight, max)

    /** Set the primary weight */
    setValue(`traitElements.${index}.weight`, weight.plus(growth))
    setHasFormChange(true)

    /**
     * Locked Distribution
     * If locked then dont distribute linearly, only to none trait (index 0)
     * @future also distribute to any other locked traits
     */
    if (locked) {
      setValue(`traitElements.${0}.weight`, Big(getValues(`traitElements.${0}.weight`)).minus(growth))
      return
    }

    /**
     * Non Locked Distribution
     * This algorithm linearly distriubtes based how big of a slice each traitElement can consume of "growth"
     * Imagine a pie chart, where each traitElement is a slice of the pie. The size of the slice is based on the
     * weight of the traitElement. The bigger the slice, the more it can consume of the growth.
     *
     * @notes by jeevan, I've explored several algorithms, and this one seems to be the most simple solution while
     *        also linearly distributing in a way that makes sense.
     *        Other solutions, I've explored are such that one would reduce everything at the same rate (or amount),
     *        but this would mean that smaller values will would hit 0 before others. That is not linear.
     */
    const sum = sumByBig(alterableTraitElements, (x) => x.weight)
    console.log({ alter: alterableTraitElements, sum: sum.toNumber() })
    traitElements.forEach((x, index) => {
      if (x.id === id) return
      if (x.locked) return
      const w = Big(x.weight)
      const size = w.div(sum).mul(growth) // the percentage of growth this traitElement can consume
      const linear = growth.mul(size)
      setValue(`traitElements.${index}.weight`, w.minus(linear))
    })
  }

  const incrementRarityInterval = (index: number) => {
    if (changeTimer.current) return
    changeTimer.current = setInterval(() => incrementRarityByIndex(index), 50)
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
       * @todo Is there a better method to handle this? Possibly a TraitElement variable in db called "none".
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
            key={key}
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
          <div
            className={clsx(
              // isNoneTraitElement(original.id) && Big(original.weight).eq(WEIGHT_LOWER_BOUNDARY) && 'border-redError',
              'w-3/4 justify-between flex items-center border border-mediumGrey rounded-[5px]'
            )}
          >
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
                  <LockClosedIcon
                    className={clsx(
                      Big(getValues(`traitElements.${0}.weight`)).eq(WEIGHT_LOWER_BOUNDARY) && 'text-redError',
                      'w-3 h-3 text-blueHighlight'
                    )}
                  />
                ) : (
                  <LockOpenIcon className='w-3 h-3 text-darkGrey' />
                )}
              </button>
              <span className='pl-2 w-full whitespace-nowrap overflow-hidden text-ellipsis flex justify-between cursor-default'>
                {`${new Big(original.weight)
                  // .abs()
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
              onClick={(e) => {
                e.preventDefault()
                incrementRarityByIndex(index)
              }}
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
                          resetRarityInterval()
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
