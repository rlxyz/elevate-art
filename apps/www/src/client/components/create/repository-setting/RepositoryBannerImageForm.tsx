import SettingLayout from '@components/layout/settings'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { formatBytes } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'
import { BannerImageUpload } from './BannerImageUpload'

export const RepositoryBannerImageForm = () => {
  const { current: repository } = useQueryRepositoryFindByName()
  return (
    <SettingLayout withSaveButton={false}>
      <SettingLayout.Header title='Banner' />
      <SettingLayout.Body>
        <div className='flex justify-between'>
          <div className='space-y-2'>
            <span className='text-sm text-black'>Click on the square towards the right to upload a custom banner from your files.</span>
            <p className='text-xs text-black'>
              We recommend an image with dimensions of <strong>1400x350 pixels</strong> and a max size of{' '}
              <strong>{formatBytes(env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED)}</strong>.
            </p>
          </div>
          {repository && <BannerImageUpload id={repository.id} />}
        </div>
      </SettingLayout.Body>
    </SettingLayout>
  )
}
