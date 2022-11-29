import { UploadState } from '@components/layout/upload/upload'
import { FC, useState } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import Upload from 'src/client/components/layout/upload'
import { useMutateTraitElementCreate } from '../../../hooks/trpc/traitElement/useMutateTraitElementCreate'

interface Props {
  onClose: () => void
  visible: boolean
}

const TraitElementCreateModal: FC<Props> = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { mutate, isLoading } = useMutateTraitElementCreate()
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title='Add Trait'
      description={`You can upload new traits here. This will be applied to all collections in the project.`}
      isLoading={!(uploadState === 'done') || isLoading}
      onClick={(e) => {
        e.preventDefault()
        onClose()
      }}
      className='md:max-w-2xl' // @todo fix this
    >
      <Upload className='h-[30vh]' depth={1} onDropCallback={mutate} setUploadState={setUploadState} gridSize='md' />
    </ModalComponent>
  )
}

export default TraitElementCreateModal
