import { TraitElement } from '@prisma/client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Table } from '../Layout/core/Table'

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
import { useFieldArray, useForm } from 'react-hook-form'

type RarityTableType = {
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
  // const [hasFormChange, setHasFormChange] = useState<boolean>(false)
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
  } = useForm<{ traitElements: { item: TraitElement }[] }>({
    defaultValues: {
      traitElements: traitElements.map((x) => {
        return {
          item: x,
        }
      }),
    },
  })

  const { fields, update } = useFieldArray({
    control,
    name: 'traitElements',
  })

  const traitElementsArray = watch('traitElements')

  const columns = useMemo<ColumnDef<RarityTableType>[]>(
    () => [
      {
        header: () => <span></span>,
        accessorKey: 'imageUrl',
        cell: ({ row: { original } }) => (
          <div className='w-10 h-10 lg:w-20 lg:h-20 flex items-center'>
            <div className='rounded-[5px] border border-mediumGrey'>
              <img className='w-10 lg:w-16 h-10 lg:h-16 rounded-[5px]' src={original.imageUrl} />
            </div>
          </div>
        ),
        footer: (props) => props.column.id,
      },
      {
        header: () => <span>Name</span>,
        accessorKey: 'name',
        cell: ({ row: { original } }) => <div>{original.name}</div>,
        footer: (props) => props.column.id,
      },
      {
        header: () => <span>Estimate In Collection</span>,
        accessorKey: 'estimateInCollection',
        cell: ({ row: { original } }) => <div>{original.estimateInCollection}</div>,
        footer: (props) => props.column.id,
      },
      {
        header: () => <span>%</span>,
        accessorKey: 'rarityScore',
        cell: ({ row: { original } }) => <div>{original.rarityScore}</div>,
        footer: (props) => props.column.id,
      },
      {
        header: () => <span>%</span>,
        accessorKey: 'rarityPercentage',
        cell: ({ row: { original } }) => <div>{original.rarityPercentage}</div>,
        footer: (props) => props.column.id,
      },
    ],
    []
  )
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

  const [data, setData] = useState<RarityTableType[]>(() =>
    traitElementsArray.map(
      ({ item: { name, layerElementId, id } }, index) =>
        ({
          imageUrl: getImageForTrait({
            r: repositoryId,
            l: layerElementId,
            t: id,
          }),
          name: name,
          estimateInCollection: 1,
          rarityScore: Number(-Math.log(watch(`traitElements.${index}.item.weight`) / initialSum).toFixed(3)) % Infinity || 0,
          rarityPercentage: `${((watch(`traitElements.${index}.item.weight`) / initialSum) * 100).toFixed(3)}%`,
        } as RarityTableType)
    )
  )

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
    </form>
  )
}

export default RepositoryRuleDisplayView
