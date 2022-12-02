import { FormModalProps } from '@components/repository/RulesSelector/RulesCreateModal'
import { useMutateOrganisationMemberDelete } from '@hooks/trpc/organisation/useMutateOrganisationMemberDelete'
import { Organisation } from '@prisma/client'
import { OrganisationNavigationEnum } from '@utils/enums'
import { useRouter } from 'next/router'
import { FC } from 'react'
import ModalComponent from 'src/client/components/layout/modal/Modal'

export interface OrganisationDeleteTeamProps extends FormModalProps {
  organisation: Organisation
}

const OrganisationMemberDeleteModal: FC<OrganisationDeleteTeamProps> = ({ visible, onClose, onSuccess, organisation }) => {
  const { mutate, isLoading } = useMutateOrganisationMemberDelete()
  const router = useRouter()

  const handleClose = () => {
    onClose()
  }

  const handleSuccess = () => {
    onSuccess && onSuccess()
    router.push(`/${OrganisationNavigationEnum.enum.Dashboard}`)
    handleClose()
  }

  return (
    <ModalComponent
      visible={visible}
      onClose={handleClose}
      onSubmit={() => mutate({ organisationId: organisation.id }, { onSuccess: handleSuccess })}
      title='Leave Team'
      description={
        <div className='row text-center'>
          <div>You are about to leave this Team. In order to regain access at a later time a Team Owner must invite you.</div>
          <br />
          <div>Are you sure you want to continue?</div>
        </div>
      }
      isLoading={isLoading}
      className='w-[30rem]'
    />
  )
}

export default OrganisationMemberDeleteModal
