import SearchInput from '@components/Layout/SearchInput'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { LayerElement, TraitElement } from '@prisma/client'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'
import { z } from 'zod'
import { TraitActionControl } from './trait-table-action-control'
import TraitElementTable from './trait-table-list'
import { useTraitElementTable } from './trait-table-list-hook'
import { TraitNavigationButton } from './trait-table-navigation-button'
import TraitElementUpdateWeightModal from './trait-update-weight-modal'

/** Server-Side Rendering is set to false as we do not need these components on startup */
export const TraitElementCreateModal = dynamic(() => import('./trait-create-modal'), { ssr: false })
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
  repositoryId: string
}

const Index: FC<Props> = ({ layerElement, repositoryId }) => {
  /**
   * Data needed for this component
   * Note, during first render, the key is empty string. The table then gets repopulated with the correct key.
   */
  const { id, traitElements } = layerElement || { id: '', traitElements: [] }

  /** Search Filter State */
  const [searchFilter, setSearchFilter] = useState('')

  /** View Filter State; toggle between grid & table view */
  const [viewFilter, setViewFilter] = useState<TraitElementViewType>(TraitElementView.enum.Table)

  /** Open Save Modal */
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)

  /**
   * It maintains all the core components needed for the TraitElementTable
   * Use this hook to add/remove functionality from the Table
   */
  const {
    table,
    isSaveable,
    isResettable,
    delete: { open: isDeleteDialogOpen, set: setIsDeleteDialogOpen },
    onFormReset,
    onFormSuccess,
    getAllTraitElements,
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
      <form>
        <div className='space-y-3'>
          <div id='trait-table-controls' className='grid grid-cols-10'>
            <div id='trait-table-controls-navigation' className='col-span-5 flex space-x-3'>
              <TraitNavigationButton viewFilter={viewFilter} setViewFilter={setViewFilter} />
              <SearchInput
                onChange={(e) => {
                  e.preventDefault()
                  setSearchFilter(e.target.value)
                }}
                isLoading={false}
              />
            </div>

            <div id='trait-table-controls-action' className='col-span-5'>
              <div className='flex justify-end h-full space-x-3'>
                {/** Reset Button */}
                <button
                  disabled={isResettable}
                  type='button'
                  onClick={() => onFormReset()}
                  className={clsx(
                    'disabled:bg-lightGray disabled:text-darkGrey disabled:border-mediumGrey',
                    'bg-lightGray border border-redError text-redError rounded-[5px] flex items-center justify-center text-xs px-2 disabled:cursor-not-allowed space-x-1'
                  )}
                >
                  <CheckCircleIcon className='w-4 h-4' />
                  <span>Reset</span>
                </button>
                {/** Save Button; this component contains a type="submit" for the HTMLFormElement */}
                <button
                  disabled={isSaveable}
                  type='button'
                  onClick={() => setIsSaveDialogOpen(true)}
                  className={clsx(
                    'disabled:bg-lightGray disabled:text-darkGrey disabled:border-mediumGrey',
                    'bg-lightGray border border-blueHighlight text-blueHighlight rounded-[5px] flex items-center justify-center text-xs px-2 disabled:cursor-not-allowed space-x-1'
                  )}
                >
                  <CheckCircleIcon className='w-4 h-4' />
                  <span>Save</span>
                </button>
                <TraitActionControl />
              </div>
            </div>
          </div>

          {/* <div id='trait-table' className='h-[calc(100vh-13.5rem)] overflow-y-scroll no-scrollbar pb-6'> */}
          <div id='trait-table'>
            <TraitElementTable table={table} className={clsx(viewFilter !== TraitElementView.enum.Table && 'hidden')} />
            <TraitElementGrid
              traitElements={getFilteredTraitElements()}
              repositoryId={repositoryId}
              className={clsx(viewFilter !== TraitElementView.enum.Grid && 'hidden')}
            />
          </div>
        </div>
      </form>
      <TraitElementDeleteModal
        visible={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        traitElements={getCheckedTraitElements()}
      />
      <TraitElementUpdateWeightModal
        visible={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        traitElements={getAllTraitElements()}
        onSuccess={() => onFormSuccess()}
      />
    </>
  )
}

export default Index
