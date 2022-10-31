import { TraitElement } from '@prisma/client'
import { Fragment, useMemo, useState } from 'react'
import { Table } from '../Layout/core/Table'

import { Popover, Transition } from '@headlessui/react'
import { CheckCircleIcon, InformationCircleIcon, PlusCircleIcon, RefreshIcon, XCircleIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useDeepCompareEffect } from '@hooks/utils/useDeepCompareEffect'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { getImageForTrait } from '@utils/image'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { env } from 'src/env/client.mjs'
import RepositoryCreateTraitDialog from './RepositoryCreateTraitDialog'
import { RepositoryDeleteTraitDialog } from './RepositoryDeleteTraitDialog'

export const calculateSumArray = (values: { weight: number }[] | undefined) => {
  return values?.reduce((a, b) => a + Number(b.weight), 0) || 0 // change to number incase someone accidently changes how textbox works
}

const RepositoryRuleDisplayView = ({ traitElements, initialSum }: { traitElements: TraitElement[]; initialSum: number }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const [hasFormChange, setHasFormChange] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const { register, handleSubmit, reset, watch, getValues, setValue, control } = useForm<{
    traitElements: (TraitElement & { checked: boolean })[]
  }>({ defaultValues: { traitElements: traitElements.map((x) => ({ ...x, checked: false })) } })

  useDeepCompareEffect(() => {
    reset({ traitElements: traitElements.map((x) => x) })
    setHasFormChange(false)
  }, [traitElements])

  const traitElementsArray = watch('traitElements')

  const columns = useMemo<ColumnDef<TraitElement & { checked: boolean }>[]>(
    () => [
      {
        header: () => <span></span>,
        accessorKey: 'select',
        cell: ({
          row: {
            original: { id },
            index,
          },
        }) => (
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
              <img
                className='w-full h-full rounded-[5px]'
                src={getImageForTrait({
                  r: repositoryId,
                  l,
                  t,
                })}
              />
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
            original: { name },
          },
        }) => <div>{name}</div>,
        footer: (props) => props.column.id,
      },
      {
        header: () => (
          <div className='flex space-x-1'>
            <span>Estimate In Collection</span>
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
                      {'We linearly distribute the rarity changes to the rest of the traits in this layer.'}
                    </p>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
        ),
        accessorKey: 'estimateInCollection',
        cell: ({ row: { original, index } }) => (
          <input
            className='bg-white text-xs w-1/2 border border-mediumGrey rounded-[5px] p-2'
            type='number'
            {...register(`traitElements.${index}.weight` as const, {
              valueAsNumber: true,
              min: 0,
              max: 100,
              onChange: (e) => {
                e.preventDefault()
                e.persist()
                !hasFormChange && setHasFormChange(true)
                const difference = Math.abs(initialSum - getValues().traitElements.reduce((acc, curr) => acc + curr.weight, 0))
                const sum = getValues().traitElements.reduce((a, c) => a + c.weight, 0) - Number(e.target.value)
                if (sum === 0) {
                  getValues().traitElements.forEach((x, index) => {
                    if (x.id === original.id) return
                    setValue(`traitElements.${index}.weight`, 0)
                  })
                  return
                }
                getValues().traitElements.forEach((x, index) => {
                  if (x.id === original.id) return
                  const minus = x.weight / difference / sum // this scales down the difference to the weight of the current element
                  setValue(`traitElements.${index}.weight` as const, x.weight - minus)
                })
              },
            })}
            min={0}
            max={100}
          />
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
        cell: ({ row: { original, index } }) => (
          <span>{Number(-Math.log(watch(`traitElements.${index}.weight`) / initialSum).toFixed(3)) % Infinity || 0}</span>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: () => <span>%</span>,
        accessorKey: 'rarityPercentage',
        cell: ({ row: { original, index } }) => (
          <span>{`${((watch(`traitElements.${index}.weight`) / initialSum) * 100).toFixed(3)}%`}</span>
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
                          setIsCreateDialogOpen(true)
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
                        onClick: () => setIsDeleteDialogOpen(true),
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
        cell: ({ row: { original, index } }) => (
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

  return (
    <>
      <form>
        <Table>
          <Table.Head>
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => {
                return (
                  <Table.Head.Row key={header.id}>
                    {header.isPlaceholder ? null : <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>}
                  </Table.Head.Row>
                )
              })
            )}
          </Table.Head>
          <Table.Body>
            {table.getRowModel().rows.map((row, index) => {
              return (
                <Table.Body.Row key={row.original.id} current={index} total={table.getRowModel().rows.length}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Table.Body.Row.Data key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Body.Row.Data>
                    )
                  })}
                </Table.Body.Row>
              )
            })}
          </Table.Body>
        </Table>
      </form>
      <RepositoryDeleteTraitDialog
        isOpen={isDeleteDialogOpen}
        traitElements={traitElementsArray.filter((x) => x.checked)}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
      <RepositoryCreateTraitDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </>
  )
}

export default RepositoryRuleDisplayView
