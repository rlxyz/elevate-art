import { TraitElement } from '@prisma/client'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Table } from '../Layout/core/Table'

import { Popover, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
  useReactTable,
} from '@tanstack/react-table'
import { getImageForTrait } from '@utils/image'
import { useForm } from 'react-hook-form'

type RarityTableType = {
  trait: TraitElement
  imageUrl: string
  name: string
  estimateInCollection: number
  rarityScore: number
  rarityPercentage: string
}

const tableHeaders: { title: JSX.Element; description?: JSX.Element }[] = [
  { title: <></> },
  { title: <></> },
  { title: <>Name</> },
  {
    title: <>Estimate in Collection</>,
    description: <>We linearly distribute the rarity changes to the rest of the traits in this layer.</>,
  },
  {
    title: <>Rarity Score</>,
    description: <>This is the rarity score of each trait in this layer. It is based on the OpenRarity standard.</>,
  },
  { title: <>%</> },
]

export const calculateSumArray = (values: { weight: number }[] | undefined) => {
  return values?.reduce((a, b) => a + Number(b.weight), 0) || 0 // change to number incase someone accidently changes how textbox works
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

const defaultColumn: Partial<ColumnDef<RarityTableType>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return <input value={value as string} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />
  },
}

const estimateColumn: Partial<ColumnDef<RarityTableType>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    const [value, setValue] = useState(initialValue)

    const onBlur = () => {
      table.options.meta?.updateData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return <input value={value as number} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />
  },
}

const LoadingTable = () => {
  return (
    <Table>
      <Table.Head loading={true}>
        {tableHeaders.map(({ title, description }, index) => {
          return <Table.Head.Row key={index} title={title} description={description} />
        })}
      </Table.Head>
      <Table.Body loading={true}>
        {Array.from(Array(10).keys()).map((_, index) => {
          return (
            <Table.Body.Row key={index} current={index} total={10} loading={true}>
              <Table.Body.Row.Data>
                <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center' />
              </Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
              <Table.Body.Row.Data>...</Table.Body.Row.Data>
            </Table.Body.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip] as const
}

const RepositoryRuleDisplayView = ({ traitElements, initialSum }: { traitElements: TraitElement[]; initialSum: number }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const [hasFormChange, setHasFormChange] = useState<boolean>(false)
  // const { current: collection } = useQueryRepositoryCollection()
  // const { mutate } = useMutateRepositoryLayersWeight({ onMutate: () => setHasFormChange(false) })
  // const { current: layer } = useQueryRepositoryLayer()
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<{ traitElements: TraitElement[] }>({ defaultValues: { traitElements: traitElements.map((x) => x) } })

  const traitElementsArray = watch('traitElements')

  const columns = useMemo<ColumnDef<TraitElement>[]>(
    () => [
      {
        header: () => <span></span>,
        accessorKey: 'imageUrl',
        cell: ({
          row: {
            original: { id: t, layerElementId: l },
          },
        }) => (
          <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center'>
            <div className='rounded-[5px] border border-mediumGrey'>
              <img
                className='w-10 lg:w-16 h-10 lg:h-16 rounded-[5px]'
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
            className='bg-white text-xs w-fit border border-mediumGrey rounded-[5px] p-2'
            type='number'
            {...register(`traitElements.${index}.weight` as const, {
              valueAsNumber: true,
              min: 0,
              max: 100,
              onChange: (e) => {
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
          <div>{Number(-Math.log(watch(`traitElements.${index}.weight`) / initialSum).toFixed(3)) % Infinity || 0}</div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: () => <span>%</span>,
        accessorKey: 'rarityPercentage',
        cell: ({ row: { original, index } }) => (
          <div>{`${((watch(`traitElements.${index}.weight`) / initialSum) * 100).toFixed(3)}%`}</div>
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
            </Popover>
          </div>
        ),
        accessorKey: 'actions',
        footer: (props) => props.column.id,
      },
    ],
    [hasFormChange]
  )

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const table = useReactTable({
    data: traitElementsArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    // meta: {
    //   updateData: (rowIndex) => {
    //     // Skip age index reset until after next rerender
    //     // skipAutoResetPageIndex()
    //     setData((old) =>
    //       old.map((row, index) => {
    //         if (index === rowIndex) {
    //           return {
    //             ...old[rowIndex]!,
    //             [columnId]: value,
    //           }
    //         }
    //         return row
    //       })
    //     )
    //   },
    // },
    debugTable: true,
  })

  return (
    <form
      onSubmit={handleSubmit((values) => {
        console.log(values)
      })}
    >
      <Table>
        <Table.Head>
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => {
              return (
                <Table.Head.Row key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanFilter() ? <div>{/* <Filter column={header.column} table={table} /> */}</div> : null}
                    </div>
                  )}
                </Table.Head.Row>
              )
            })
          )}
        </Table.Head>
        <Table.Body>
          {table.getRowModel().rows.map((row, index) => {
            return (
              <Table.Body.Row key={row.id} current={index} total={table.getRowModel().rows.length}>
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
  )
}

export default RepositoryRuleDisplayView
