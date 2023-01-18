import SettingLayout from '@components/layout/settings'
import Textarea from '@components/layout/textarea/Textarea'
import { useMutateOrganisationUpdateDescription } from '@hooks/trpc/organisation/useMutateOrganisationUpdateDescription'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useForm } from 'react-hook-form'

export const OrganisationDescriptionForm = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const { mutate, isLoading } = useMutateOrganisationUpdateDescription()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: organisation?.description || '',
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        if (!organisation) return
        mutate({
          organisationId: organisation.id,
          description: data.description,
        })
      })}
      disabled={isLoading}
    >
      <SettingLayout.Header title='Description' description='A short description of your Team.' />
      <SettingLayout.Body>
        <Textarea
          {...register('description', {
            required: true,
          })}
          placeholder={organisation?.description || ''}
          defaultValue={organisation?.description || ''}
          rows={5}
          wrap='soft'
          aria-invalid={errors.description ? 'true' : 'false'}
        />
      </SettingLayout.Body>
    </SettingLayout>
  )
}
