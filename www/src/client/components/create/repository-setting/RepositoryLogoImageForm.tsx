import AvatarComponent from '@components/layout/avatar/Avatar'
import SettingLayout from '@components/layout/settings'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { useForm } from 'react-hook-form'

export const RepositoryLogoImageForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  const { organisationName } = useRepositoryRoute()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: repository?.name,
    },
  })

  return (
    <SettingLayout withSaveButton={false}>
      <SettingLayout.Header title='Logo' />
      <SettingLayout.Body>
        <div className='flex justify-between'>
          <div className='space-y-2'>
            <p className='text-sm text-black'>Click on the circle towards the right to upload a custom one from your files.</p>
            <p className='text-xs text-black'>
              We recommend a square image with a <strong>minimum size of 50x50 pixels</strong>.
            </p>
          </div>
          <button onClick={(e) => e.preventDefault()}>
            <AvatarComponent src={repository?.logoImageUrl || '/images/logo-black.png'} variant='lg' />
          </button>
        </div>
      </SettingLayout.Body>
    </SettingLayout>
  )
}
