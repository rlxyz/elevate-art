import SettingLayout from '@components/layout/settings'
import Textarea from '@components/layout/textarea/Textarea'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useForm } from 'react-hook-form'

export const RepositoryDescriptionForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: repository?.description,
    },
  })

  return (
    <SettingLayout
      onSubmit={handleSubmit((data) => {
        console.log(data)
      })}
    >
      <SettingLayout.Header
        title='Description'
        description='A short description of your project. Note, this is also added to the metadata of the tokens in this collection'
      />
      <SettingLayout.Body>
        <Textarea
          {...register('description', {
            required: true,
          })}
          placeholder={repository?.description || ''}
          rows={5}
          wrap='soft'
          aria-invalid={errors.description ? 'true' : 'false'}
        />
      </SettingLayout.Body>
    </SettingLayout>
  )
}
