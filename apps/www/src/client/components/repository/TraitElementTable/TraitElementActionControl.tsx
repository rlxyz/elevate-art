import type { Organisation, Repository } from '@prisma/client'
import type { FC } from 'react'
import { useState } from 'react'
import { TraitElementCreateModal } from './index'

export const TraitElementActionControl: FC<{ repository: Repository | undefined; organisation: Organisation | undefined }> = ({
  repository,
  organisation,
}) => {
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
      {isCreateDialogOpen && repository && organisation && (
        <TraitElementCreateModal
          visible={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          repository={repository}
          organisation={organisation}
        />
      )}
    </>
  )
}
