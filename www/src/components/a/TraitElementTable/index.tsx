import { DebouncedSearchComponent } from '@components/y/search/DebouncedSearch'
import { CheckCircleIcon, CubeTransparentIcon } from '@heroicons/react/outline'
import { TraitElementWithImage } from '@hooks/query/useQueryRepositoryLayer'
import { LayerElement } from '@prisma/client'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'
import { z } from 'zod'
import { useTraitElementTable } from '../../../hooks/utils/useTraitElementTable'
import { TraitElementActionControl } from './TraitElementActionControl'
import { TraitElementNavigationButton } from './TraitElementNavigationButton'
import TraitElementTable from './TraitElementTable'
import TraitElementUpdateWeightModal from './TraitElementUpdateWeightModal'

/** Server-Side Rendering is set to false as we do not need these components on startup */
export const TraitElementCreateModal = dynamic(() => import('./TraitElementCreateModal'), { ssr: false })
const TraitElementDeleteModal = dynamic(() => import('./TraitElementDeleteModal'), { ssr: false })
const TraitElementGrid = dynamic(() => import('./TraitElementGrid'))

/** View Enum */
export const TraitElementView = z.nativeEnum(
  Object.freeze({
    Table: 'table',
    Grid: 'grid',
  })
)

export type TraitElementViewType = z.infer<typeof TraitElementView>

interface Props {
  layerElement: (LayerElement & { traitElements: TraitElementWithImage[] }) | undefined
  repositoryId: string
  className: string
}

const Index: FC<Props> = ({ className, layerElement, repositoryId }) => {
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
    globalFilter,
    onFormRandom,
    setGlobalFilter,
  } = useTraitElementTable({
    key: id,
    traitElements,
    repositoryId,
    searchFilter,
  })

  return (
    <div className={clsx(className)}>
      <form>
        <div className='space-y-3'>
          <div id='trait-table-controls' className='grid grid-cols-10'>
            <div id='trait-table-controls-navigation' className='col-span-5 flex space-x-3'>
              <TraitElementNavigationButton viewFilter={viewFilter} setViewFilter={setViewFilter} />
              <DebouncedSearchComponent value={globalFilter ?? ''} onChange={(value) => setGlobalFilter(String(value))} />
            </div>

            <div id='trait-table-controls-action' className='col-span-5'>
              <div className='flex justify-end h-full space-x-3'>
                <button
                  type='button'
                  onClick={() => onFormRandom()}
                  className={clsx(
                    'disabled:bg-lightGray disabled:text-darkGrey disabled:border-mediumGrey',
                    'bg-lightGray border border-blueHighlight text-blueHighlight rounded-[5px] flex items-center justify-center text-xs px-2 disabled:cursor-not-allowed space-x-1'
                  )}
                >
                  <CubeTransparentIcon className='w-4 h-4' />
                  <span>Random</span>
                </button>

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
                    'bg-lightGray border border-greenDot text-greenDot rounded-[5px] flex items-center justify-center text-xs px-2 disabled:cursor-not-allowed space-x-1'
                  )}
                >
                  <CheckCircleIcon className='w-4 h-4' />
                  <span>Save</span>
                </button>
                <TraitElementActionControl />
              </div>
            </div>
          </div>

          <div id='trait-table'>
            <TraitElementTable table={table} className={clsx(viewFilter !== TraitElementView.enum.Table && 'hidden')} id={id} />
            <TraitElementGrid table={table} id={id} className={clsx(viewFilter !== TraitElementView.enum.Grid && 'hidden')} />
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
    </div>
  )
}

export default Index
