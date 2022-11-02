import ModalComponent from '@components/Layout/Modal'
import Upload from '@components/Layout/upload'
import { FC } from 'react'
import { useMutateCreateTrait } from './trait-create-mutate-hook'

interface Props {
  onClose: () => void
  visible: boolean
}

const TraitElementCreateModal: FC<Props> = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { mutate, isLoading } = useMutateCreateTrait()
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title='Add Trait'
      description={`You can upload new traits here. This will be applied to all collections in the project.`}
      data={[]}
      isLoading={isLoading}
      onClick={(e) => {
        e.preventDefault()
      }}
    >
      <Upload className='h-[30vh]' depth={1} onDropCallback={mutate} />
    </ModalComponent>
  )
}

export default TraitElementCreateModal
