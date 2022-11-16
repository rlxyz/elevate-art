import { Popover, Transition } from '@headlessui/react'
import { InformationCircleIcon, LockClosedIcon, LockOpenIcon, MinusIcon, PlusIcon, XCircleIcon } from '@heroicons/react/outline'
import { TraitElementWithImage } from '@hooks/query/useQueryRepositoryLayer'
import { compareItems, RankingInfo, rankItem } from '@tanstack/match-sorter-utils'
import {
  ColumnDef,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingFn,
  sortingFns,
  useReactTable,
} from '@tanstack/react-table'
import { sumByBig } from '@utils/object-utils'
import Big from 'big.js'
import clsx from 'clsx'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { FieldArrayWithId } from 'react-hook-form'
import { env } from 'src/env/client.mjs'
import {
  TraitElementFields,
  TraitElementRarityFormType,
  useTraitElementForm,
  WEIGHT_LOWER_BOUNDARY,
} from './trait-table-list-form-hook'
import { useMutateRenameTraitElement } from './trait-update-name-mutate-hook'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

/**
 * This hook handles all the core logic for the TraitElement table form.
 */
export const useTraitElementTable = ({
  traitElements,
  repositoryId,
  key,
  searchFilter = '',
}: {
  traitElements: TraitElementWithImage[]
  repositoryId: string
  key: string
  searchFilter?: string
}) => {
  const [isRarityResettable, setIsRarityResettable] = useState<boolean>(false)
  const [isTraitDeletable, setIsTraitDeletable] = useState<boolean>(false)
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
    isIncreaseRarityPossible,
    isDecreaseRarityPossible,
    decrementRarityByIndex,
    incrementRarityByIndex,
    isNoneTraitElement,
  } = useTraitElementForm({
    traitElements,
    onChange: () => setIsRarityResettable(true),
  })

  /**
   * This is use the reset the rarity button's increment/decement interval reference.
   */
  const resetRarityInterval = () => {
    if (!changeTimer.current) return
    clearInterval(changeTimer.current)
    changeTimer.current = null
  }

  const incrementRarityInterval = (index: number) => {
    if (changeTimer.current) return
    changeTimer.current = setInterval(() => incrementRarityByIndex(index), 50)
  }

  const decrementRarityInterval = (index: number) => {
    if (changeTimer.current) return
    changeTimer.current = setInterval(() => decrementRarityByIndex(index), 50)
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

  /**
   * Reset Effect
   * This effect resets the Table.
   */
  useEffect(() => {
    setValue('allCheckboxesChecked', false)
    setIsRarityResettable(false)
    setIsTraitDeletable(false)
    reset({ traitElements: traitElements.map((x) => ({ ...x, checked: false, locked: false })) })
  }, [key, traitElements.length])

  /** Run during rarity change */
  const onFormSuccess = () => {
    setIsRarityResettable(false)
  }

  const columns = useMemo<ColumnDef<FieldArrayWithId<TraitElementRarityFormType, 'traitElements', 'id'>>[]>(
    () => [
      {
        header: () => (
          <input
            disabled={getValues('traitElements').length === 1} // only none trait exists
            key={key}
            type='checkbox'
            {...register(`allCheckboxesChecked`)}
            className={clsx(
              'border border-mediumGrey',
              'text-xs rounded-[5px]',
              'focus:outline-none focus:ring-blueHighlight',
              'invalid:border-redError invalid:text-redError',
              'focus:invalid:border-redError focus:invalid:ring-redError',
              'disabled:cursor-not-allowed'
            )}
            onClick={(e) => {
              const checked = e.currentTarget.checked

              /** Set the trait deletable boolean to allow user to click delete modal */
              if (checked) {
                setIsTraitDeletable(true)
              } else {
                setIsTraitDeletable(false)
              }

              getValues(`traitElements`).forEach((x, index) => {
                /**
                 * Skip none trait. Cannot be deleted.
                 * @todo Is there a better method to handle this? Possibly a TraitElement variable in db called "none".
                 */
                if (isNoneTraitElement(index)) {
                  return
                }

                setValue(`traitElements.${index}.checked`, checked)
              })
            }}
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
            {!isNoneTraitElement(index) && (
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
                onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
                  const checked = e.currentTarget.checked

                  /** Preempt set the value */
                  setValue(`traitElements.${index}.checked`, checked)

                  /** Set the deletable trait to true or false */
                  if (
                    checked ||
                    getValues(`traitElements`)
                      .filter((_, i) => i !== index)
                      .some((x) => x.checked)
                  ) {
                    setIsTraitDeletable(true)
                  } else {
                    setIsTraitDeletable(false)
                  }

                  /** Set the allCheckboxesChecked depending on the total checkbox state */
                  if (
                    getValues(`traitElements`)
                      .slice(1)
                      .every((x) => x.checked)
                  ) {
                    setValue(`allCheckboxesChecked`, true)
                  } else {
                    setValue(`allCheckboxesChecked`, false)
                  }
                }}
              />
            )}
          </>
        ),
        footer: (props) => props.column.id,
        enableSorting: false,
      },
      {
        header: () => <span></span>,
        accessorKey: 'imageUrl',
        cell: ({
          row: {
            original: { imageUrl },
          },
        }) => (
          <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center px-1'>
            <div className='rounded-[5px] border border-mediumGrey'>
              {imageUrl && <img className='w-full h-full rounded-[5px]' src={imageUrl} />}
            </div>
          </div>
        ),
        footer: (props) => props.column.id,
        enableSorting: false,
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
            {!isNoneTraitElement(index) ? (
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
                          This trait can be used for situations where you dont want to assign a trait to a layer. It cannot be
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
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        enableSorting: true,
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
              disabled={isDecreaseRarityPossible(index)}
              className='border-r border-mediumGrey px-2 py-2 disabled:cursor-not-allowed'
              onMouseDown={(e) => {
                decrementRarityInterval(index)
              }}
              onMouseUp={resetRarityInterval}
              onMouseLeave={resetRarityInterval}
              onClick={(e) => {
                e.preventDefault()
                decrementRarityByIndex(index)
              }}
              type='button'
            >
              <MinusIcon className='w-2 h-2 text-darkGrey' />
            </button>
            <div className='w-full flex items-center justify-between py-1 text-xs px-2'>
              <button
                disabled={isNoneTraitElement(index)}
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
        enableSorting: false,
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
        accessorKey: 'weight',
        cell: ({ row: { original } }) => (
          <span>
            {Number(
              -Math.log(new Big(original.weight).div(sumByBig(watch(`traitElements`), (x) => x.weight)).toNumber()).toFixed(3)
            ) % Infinity || 0}
          </span>
        ),
        footer: (props) => props.column.id,
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
        enableSorting: true,
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
                {isTraitDeletable && (
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
                        name: 'Delete',
                        icon: <XCircleIcon className='w-4 h-4' />,
                        onClick: () => setIsDeletedClicked(true),
                        disabled: !(traitElementsArray.filter((x) => x.checked).length > 0),
                      },
                    ].map(({ disabled, name, icon, onClick }, index) => (
                      <button
                        key={`${key}-${name}`}
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
        enableSorting: false,
        cell: ({ row: { original, index } }) =>
          !isNoneTraitElement(index) && (
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
    [isRarityResettable, isTraitDeletable]
  )

  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable<TraitElementFields>({
    data: traitElementsArray,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: env.NEXT_PUBLIC_NODE_ENV === 'production' ? false : true,
    debugColumns: env.NEXT_PUBLIC_NODE_ENV === 'production' ? false : true,
    debugHeaders: env.NEXT_PUBLIC_NODE_ENV === 'production' ? false : true,
  })

  return {
    table,
    delete: { open: isDeleteClicked, set: setIsDeletedClicked },
    create: { open: isCreateClicked, set: setIsCreateClicked },
    isSaveable: !isRarityResettable, // do not be afriad to add move states here aside from isRarityResettable for isSaveable
    isResettable: !isRarityResettable, // do not be afriad to add move states here aside from isRarityResettable for isSaveable
    onFormSuccess: () => onFormSuccess(),
    onFormReset: () => {
      reset()
      setIsRarityResettable(false)
      resetRarityInterval()
    },
    handleSubmit,
    globalFilter,
    setGlobalFilter,
    getFilteredTraitElements: () => traitElementsArray.filter((x) => x.name.toLowerCase().includes(searchFilter.toLowerCase())),
    getCheckedTraitElements: () => traitElementsArray.filter((x) => x.checked),
    getAllTraitElements: () => traitElementsArray,
  }
}

const fuzzyFilter: FilterFn<TraitElementFields> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Don't filter-out readonly
  if (row.original.readonly) return true

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const fuzzySort: SortingFn<TraitElementFields> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(rowA.columnFiltersMeta[columnId]?.itemRank!, rowB.columnFiltersMeta[columnId]?.itemRank!)
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
