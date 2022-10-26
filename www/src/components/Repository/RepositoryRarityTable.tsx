import { TraitElement } from '@prisma/client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Table } from '../Layout/core/Table'

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
  useReactTable,
} from '@tanstack/react-table'
import { getImageForTrait } from '@utils/image'

type RarityTableType = {
  imageUrl: string
  name: string
  estimateInCollection: number
  rarityScore: number
  rarityPercentage: string
}

const columnHelper = createColumnHelper<RarityTableType>()

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

export type Person = {
  imageUrl: string
  name: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Person[]
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  return {
    imageUrl: 'faker.name.imageUrl()',
    name: 'aker.name.name()',
    age: 123,
    visits: 123,
    progress: 100,
    status: 'single',
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

export const calculateSumArray = (values: { weight: number }[] | undefined) => {
  return values?.reduce((a, b) => a + Number(b.weight), 0) || 0 // change to number incase someone accidently changes how textbox works
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

const defaultColumn: Partial<ColumnDef<Person>> = {
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

const RepositoryRuleDisplayView = ({ traitElements }: { traitElements: TraitElement[] }) => {
  // const repositoryId = useRepositoryStore((state) => state.repositoryId)
  // const [hasFormChange, setHasFormChange] = useState<boolean>(false)
  // const { current: collection } = useQueryRepositoryCollection()
  // const { mutate } = useMutateRepositoryLayersWeight({ onMutate: () => setHasFormChange(false) })
  // const { current: layer } = useQueryRepositoryLayer()
  // const {
  //   register,
  //   setError,
  //   clearErrors,
  //   handleSubmit,
  //   reset,
  //   watch,
  //   getValues,
  //   setValue,
  //   control,
  //   formState: { errors, isDirty },
  // } = useForm<{ traitElements: { item: TraitElement }[] }>({
  //   defaultValues: {
  //     traitElements: traitElements.map((x) => {
  //       return {
  //         item: x,
  //       }
  //     }),
  //   },
  // })

  // const columns = useMemo<ColumnDef<RarityTableType>[]>(
  //   () => [
  //     {
  //       accessorKey: 'imageUrl',
  //       header: '..',
  //       footer: (props) => props.column.id,
  //     },
  //     {
  //       accessorKey: 'name',
  //       header: 'Name',
  //       footer: (props) => props.column.id,
  //     },
  //     {
  //       accessorKey: 'estimateInCollection',
  //       header: 'Estimate in Collection',
  //       footer: (props) => props.column.id,
  //     },
  //     {
  //       header: 'Rarity Score',
  //       accessorKey: 'rarityScore',
  //       footer: (props) => props.column.id,
  //     },
  //     {
  //       header: '%',
  //       accessorKey: 'rarityPercentage',
  //       footer: (props) => props.column.id,
  //     },
  //   ],
  //   []
  // )

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        header: '....',
        accessorKey: 'imageUrl',
        cell: ({ row: { original } }) => (
          <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center'>
            <div className='rounded-[5px] border border-mediumGrey'>
              <img
                className='w-10 lg:w-16 h-10 lg:h-16 rounded-[5px]'
                src={getImageForTrait({
                  r: '',
                  l: '',
                  t: '',
                })}
              />
            </div>
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row: { original } }) => <div>{original.name}</div>,
        footer: (props) => props.column.id,
      },
    ],
    []
  )

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const [data, setData] = useState(() => makeData(1000))

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip age index reset until after next rerender
        skipAutoResetPageIndex()
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
    debugTable: true,
  })

  // const table = useReactTable({
  //   // data: getValues().traitElements.map(
  //   //   ({ item: { name, layerElementId, id } }, index) =>
  //   //     ({
  //   //       imageUrl: getImageForTrait({
  //   //         r: repositoryId,
  //   //         l: layerElementId,
  //   //         t: id,
  //   //       }),
  //   //       name: name,
  //   //       estimateInCollection: 1,
  //   //       rarityScore: 1,
  //   //       rarityPercentage: `1%`,
  //   //       // rarityScore: Number(-Math.log(watch(`traitElements.${index}.item.weight`) / initialSum).toFixed(3)) % Infinity || 0,
  //   //       // rarityPercentage: `${((watch(`traitElements.${index}.item.weight`) / initialSum) * 100).toFixed(3)}%`,
  //   //     } as RarityTableType)
  //   // ),
  //   data: [{ imageUrl: '', name: 'test', estimateInCollection: 1, rarityScore: 1, rarityPercentage: '1%' }],
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   // meta: {
  //   //   updateEstimate: (id: string) => {},
  //   // },
  //   // debugTable: true,
  // })

  // const summedRarityWeightage = calculateSumArray(layer?.traitElements)
  return (
    <form>
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
      {/* <Table.Body>
          {table.getRowModel().rows.map((row, index) => (
            <Table.Body.Row key={row.id} current={index} total={table.getRowModel().rows.length}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </Table.Body.Row>
          ))}
        </Table.Body> */}
      {/* <Table.Body>
          {traitElements?.map(({ name, id, layerElementId }: TraitElement, index: number) => (
            <Table.Body.Row key={id} current={index} total={traitElements?.length}>
              <Table.Body.Row.Data>
                <div className='w-4 h-4 border border-mediumGrey bg-white rounded-[3px]' />
                <></>
              </Table.Body.Row.Data>
              <Table.Body.Row.Data>
                <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center'>
                  <div className='rounded-[5px] border border-mediumGrey'>
                    <img
                      className='w-10 lg:w-16 h-auto rounded-[5px]'
                      src={getImageForTrait({
                        r: repositoryId,
                        l: layerElementId,
                        t: id,
                      })}
                    />
                  </div>
                </div>
              </Table.Body.Row.Data>
              <Table.Body.Row.Data>{truncate(name)}</Table.Body.Row.Data>
              <Table.Body.Row.Data>
                <div className='flex space-x-3 items-center justify-start'>
                          <div className='w-20'>
                            <input
                              className='bg-white text-xs w-full border border-mediumGrey rounded-[5px] p-2'
                              id={`traits.${index}.weight`}
                              type='number'
                              name={`traits.${index}.weight`}
                              min={0}
                              max={collection.totalSupply}
                              value={values.traits[index]?.weight}
                              onChange={(e) => {
                                e.persist()
                                !hasFormChange && setHasFormChange(true)
                                const trait = values.traits.find((x) => x.id === id)
                                if (!trait) {
                                  resetForm()
                                  return
                                }
                                handleChange(e)
                                // if (Number(e.target.value) + calculateSumArray(values.traits) > collection.totalSupply) {
                                //   return
                                // }
                                const difference = trait.weight - Number(e.target.value)
                                const linearDistributeLength =
                                  values.traits.length - values.traits.filter((v) => v.weight === 0).length - 1
                                values.traits = values.traits.map((t) => {
                                  if (t.weight === 0) return { ...t, weight: 0 }
                                  return {
                                    id: t.id,
                                    weight: t.weight + difference / linearDistributeLength,
                                  }
                                })
                              }}
                            />
                          </div>
                          <span>out of {collection.totalSupply}</span>
                        </div>
              </Table.Body.Row.Data>
              <Table.Body.Row.Data>
                <span className='whitespace-nowrap text-ellipsis w-16'>
                  {Number(-Math.log((values.traits[index]?.weight || 0) / calculateSumArray(values.traits)).toFixed(3)) %
                    Infinity || 0}
                </span>
              </Table.Body.Row.Data>
              <Table.Body.Row.Data>
                {(((values.traits[index]?.weight || 0) / calculateSumArray(values.traits)) * 100).toFixed(3)}%
              </Table.Body.Row.Data>
            </Table.Body.Row>
          ))}
        </Table.Body> */}
    </form>
  )
}

export default RepositoryRuleDisplayView
