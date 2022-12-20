import { UploadState } from '@components/layout/upload/upload'
import { useMutateTraitElementCreate } from '@hooks/trpc/traitElement/useMutateTraitElementCreate'
import { Organisation, Repository } from '@prisma/client'
import { FC, useState } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'
import Upload from 'src/client/components/layout/upload'
import { FormModalProps } from '../LayerElementFileTree/LayerElementDeleteModal'

interface TraitElementCreateModalProps extends FormModalProps {
  repository: Repository
  organisation: Organisation
}

const TraitElementCreateModal: FC<TraitElementCreateModalProps> = ({ visible, onClose, repository, organisation }) => {
  const { mutate } = useMutateTraitElementCreate()
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title='Add Trait'
      description={`You can upload new traits here. This will be applied to all collections in the project.`}
      isLoading={uploadState === 'uploading'}
      onClick={(e) => {
        e.preventDefault()
        onClose()
      }}
      className='md:max-w-2xl' // @todo fix this
    >
      <Upload
        className='h-[30vh]'
        depth={1}
        onDropCallback={mutate}
        setUploadState={setUploadState}
        gridSize='md'
        withTooltip={true}
        organisation={organisation}
        repository={repository}
      />
    </ModalComponent>
  )
}

export default TraitElementCreateModal
