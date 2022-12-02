import { FormModalProps } from '@components/repository/RulesSelector/RulesCreateModal'
import { useMutateOrganisationCreateTeam } from '@hooks/trpc/organisation/useMutateOrganisationCreateTeam'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import clsx from 'clsx'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import ModalComponent from 'src/client/components/layout/modal/Modal'

export interface OrganisationLeaveTeamProps extends FormModalProps {}

export type OrganisationLeaveTeamForm = {
  name: string
}

const OrganisationLeaveTeamModal: FC<OrganisationLeaveTeamProps> = ({ visible, onClose, onSuccess }) => {
  const { mutate, isLoading } = useMutateOrganisationCreateTeam()
  const { all: organisations } = useQueryOrganisationFindAll()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrganisationLeaveTeamForm>({
    defaultValues: {
      name: '',
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSuccess = () => {
    onSuccess && onSuccess()
    handleClose()
  }

  return (
    <ModalComponent
      visible={visible}
      onClose={handleClose}
      onSubmit={handleSubmit((data) => mutate({ name: data.name }, { onSuccess: handleSuccess }))}
      title='Create Team'
      description={`This will create a new team. You will be able to add members to this team later.`}
      isLoading={isLoading}
      className='w-[30rem]'
    >
      <div className='divide-y divide-mediumGrey space-y-6'>
        <div className='space-y-1 flex flex-col'>
          <span className='text-xs font-base'>Team Name</span>
          <input
            className={clsx('block text-xs w-full pl-2 rounded-[5px] py-2')}
            type='string'
            {...register('name', {
              required: true,
              maxLength: 20,
              minLength: 4,
              pattern: /^[-/a-z0-9 ]+$/gi,
              validate: (value) => !organisations?.map((x) => x.name).includes(value),
            })}
          />
          {errors.name && (
            <span className='text-xs text-redError'>
              {errors.name.type === 'required'
                ? 'This field is required'
                : errors.name.type === 'pattern'
                ? 'We only accept - and / for special characters'
                : errors.name.type === 'validate'
                ? 'An organisation with this name already exists'
                : 'Must be between 4 and 20 characters long'}
            </span>
          )}
        </div>
      </div>
    </ModalComponent>
  )
}

export default OrganisationLeaveTeamModal
