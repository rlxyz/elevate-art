import { FC, useState } from 'react'
import { TraitElementCreateModal } from './index'

export const TraitElementActionControl: FC<any> = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  return (
    <>
      <button
        type='button'
        onClick={() => setIsCreateDialogOpen(true)}
        className='bg-blueHighlight border border-blueHighlight text-white font-semibold rounded-[5px] flex items-center justify-center text-xs px-2 disabled:cursor-not-allowed space-x-1'
      >
        New
      </button>
      {isCreateDialogOpen && <TraitElementCreateModal visible={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />}
    </>
  )
}
