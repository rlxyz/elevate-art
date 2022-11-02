import { TraitElement } from '@prisma/client'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import { z } from 'zod'
import { useTraitElementForm } from './trait-form-hook'
import TraitElementGrid from './trait-grid'
import TraitElementTable from './trait-table'

/** Server-Side Rendering is set to false as we do not need these components on startup */
const TraitElementCreateModal = dynamic(() => import('./trait-create-modal'), { ssr: false })
const TraitElementDeleteModal = dynamic(() => import('./trait-delete-modal'), { ssr: false })

/** View Enum */
export const TraitElementView = z.nativeEnum(
  Object.freeze({
    Table: 'table',
    Grid: 'grid',
  })
)

export type TraitElementViewType = z.infer<typeof TraitElementView>

interface Props {
  traitElements: TraitElement[]
  view: TraitElementViewType
  repositoryId: string
  searchFilter: string
}

const Index: FC<Props> = ({ traitElements, repositoryId, searchFilter, view }) => {
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
  } = useTraitElementForm({ traitElements, repositoryId, initialSum: 0, searchFilter })

  return (
    <>
      <TraitElementTable table={table} className={clsx(view === TraitElementView.enum.Table && 'hidden')} />
      <TraitElementGrid
        traitElements={getFilteredTraitElements()}
        repositoryId={repositoryId}
        className={clsx(view === TraitElementView.enum.Grid && 'hidden')}
      />
      <TraitElementDeleteModal
        visible={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        traitElements={getCheckedTraitElements()}
      />
      <TraitElementCreateModal isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </>
  )
}

export default Index
