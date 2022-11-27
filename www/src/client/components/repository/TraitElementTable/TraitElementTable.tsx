import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { flexRender, Table as ReactTable } from '@tanstack/react-table'
import clsx from 'clsx'
import { FC } from 'react'
import { Table } from 'src/client/components/layout/core/Table'
import { TraitElementFields } from '../../../hooks/trpc/traitElement/useTraitElementForm'

interface Props {
  table: ReactTable<TraitElementFields>
  id: string
}

export type TraitElementTableProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * This Functional Component maintains all the logic related to the TraitElementTable.
 * It connects the useTraitElementForm hook with the TraitElementCreateModal & TraitElementDeleteModal
 *
 * @todo initialSum removed as prop. it should be generated here.
 */
const TraitElementTable: FC<TraitElementTableProps> = ({ table, className, id, ...props }) => {
  return (
    <div className={clsx(className)} {...props}>
      {/* Use this to debug the sum of traitElement's weight */}
      {/* <span>{sumByBig(table.getRowModel().rows, (x) => x.original.weight).toNumber()}</span> */}
      <Table>
        <Table.Head>
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => {
              return (
                <Table.Head.Row key={header.id}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none flex items-center space-x-1' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUpIcon className='w-3 h-3 text-darkGrey' />,
                          desc: <ChevronDownIcon className='w-3 h-3 text-darkGrey' />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </>
                  )}
                </Table.Head.Row>
              )
            })
          )}
        </Table.Head>
        <Table.Body>
          {/** Sort the None TraitElement to index 0 then displays the Table */}
          {table
            .getRowModel()
            .rows.sort((a, b) => (a.original.id === `none-${id}` ? -1 : 1))
            .map((row, index) => {
              return (
                <Table.Body.Row key={row.original.id} current={index} total={table.getRowModel().rows.length}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Table.Body.Row.Data key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Body.Row.Data>
                    )
                  })}
                </Table.Body.Row>
              )
            })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default TraitElementTable
