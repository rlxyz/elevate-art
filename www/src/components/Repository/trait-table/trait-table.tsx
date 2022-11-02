import { TraitElement } from '@prisma/client'
import { flexRender } from '@tanstack/react-table'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import { Table } from '../../Layout/core/Table'
import { useTraitElementForm } from './trait-form-hook'

/** Server-Side Rendering is set to false as we do not need these components on startup */
const TraitElementCreateModal = dynamic(() => import('./trait-create-modal'), { ssr: false })
const TraitElementDeleteModal = dynamic(() => import('./trait-delete-modal'), { ssr: false })

interface Props {
  traitElements: TraitElement[]
  initialSum: number
  repositoryId: string
}

/**
 * This Functional Component maintains all the logic related to the TraitElementTable.
 * It connects the useTraitElementForm hook with the TraitElementCreateModal & TraitElementDeleteModal
 *
 * @todo initialSum removed as prop. it should be generated here.
 */
const TraitElementTable: FC<Props> = ({ traitElements, initialSum, repositoryId }) => {
  /**
   * It maintains all the core components needed for the TraitElementTable
   * Use this hook to add/remove functionality from the Table
   */
  const {
    table,
    create: { open: isCreateDialogOpen, set: setIsCreateDialogOpen },
    delete: { open: isDeleteDialogOpen, set: setIsDeleteDialogOpen },
    traitElements: traitElementFormData,
  } = useTraitElementForm({ traitElements, repositoryId, initialSum })

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
      <TraitElementDeleteModal
        isOpen={isDeleteDialogOpen}
        traitElements={traitElementFormData.filter((x) => x.checked)}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
      <TraitElementCreateModal isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </>
  )
}

export default TraitElementTable
