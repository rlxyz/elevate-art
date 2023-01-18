import { LogoImageUpload } from '@components/create/repository-setting/LogoImageUpload'
import SettingLayout from '@components/layout/settings'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { formatBytes } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'

export const OrganisationLogoImageForm = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  return (
    <SettingLayout withSaveButton={false}>
      <SettingLayout.Header title='Logo' />
      <SettingLayout.Body>
        <div className='flex justify-between'>
          <div className='space-y-2'>
            <span className='text-sm text-black'>Click on the circle towards the right to upload a custom logo from your files.</span>
            <p className='text-xs text-black'>
              We recommend an image with dimensions of <strong>350x350 pixels</strong> and a max size of{' '}
              <strong>{formatBytes(env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED)}</strong>.
            </p>
          </div>
          {organisation && <LogoImageUpload id={organisation.id} />}
        </div>
      </SettingLayout.Body>
    </SettingLayout>
  )
}
