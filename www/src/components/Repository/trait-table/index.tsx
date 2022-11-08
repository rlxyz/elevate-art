import { LayerElement, TraitElement } from '@prisma/client'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import { z } from 'zod'
import TraitElementTable from './trait-table-list'
import { useTraitElementTable } from './trait-table-list-hook'

/** Server-Side Rendering is set to false as we do not need these components on startup */
const TraitElementCreateModal = dynamic(() => import('./trait-create-modal'), { ssr: false })
const TraitElementDeleteModal = dynamic(() => import('./trait-delete-modal'), { ssr: false })
const TraitElementGrid = dynamic(() => import('./trait-table-grid'))

/** View Enum */
export const TraitElementView = z.nativeEnum(
  Object.freeze({
    Table: 'table',
    Grid: 'grid',
  })
)

export type TraitElementViewType = z.infer<typeof TraitElementView>

interface Props {
  layerElement: (LayerElement & { traitElements: TraitElement[] }) | undefined
  view: TraitElementViewType
  repositoryId: string
  searchFilter: string
}

const Index: FC<Props> = ({ layerElement, repositoryId, searchFilter, view }) => {
  /**
   * Data needed for this component
   * Note, during first render, the key is empty string. The table then gets repopulated with the correct key.
   */
  const { id, traitElements } = layerElement || { id: '', traitElements: [] }

  /**
   * It maintains all the core components needed for the TraitElementTable
   * Use this hook to add/remove functionality from the Table
   */
  const {
    table,
    create: { open: isCreateDialogOpen, set: setIsCreateDialogOpen },
    delete: { open: isDeleteDialogOpen, set: setIsDeleteDialogOpen },
    getFilteredTraitElements,
    getCheckedTraitElements,
  } = useTraitElementTable({
    key: id,
    traitElements,
    repositoryId,
    searchFilter,
  })

  return (
    <>
      <TraitElementTable table={table} className={clsx(view !== TraitElementView.enum.Table && 'hidden')} />
      <TraitElementGrid
        traitElements={getFilteredTraitElements()}
        repositoryId={repositoryId}
        className={clsx(view !== TraitElementView.enum.Grid && 'hidden')}
      />
      <TraitElementDeleteModal
        visible={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        traitElements={getCheckedTraitElements()}
      />
      <TraitElementCreateModal visible={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </>
  )
}

export default Index
