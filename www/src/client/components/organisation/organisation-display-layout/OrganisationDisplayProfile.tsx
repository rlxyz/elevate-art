import AvatarComponent from '@components/layout/avatar/Avatar'
import { DescriptionWithDisclouser } from '@components/layout/DescriptionWithDisclouser'
import { createLogoUrl } from '@components/layout/LogoDisplay'
import type { Organisation } from '@prisma/client'

export const OrganisationDisplayProfile = ({ organisation }: { organisation: Organisation | undefined | null }) => {
  return (
    <div className='flex flex-row space-x-6'>
      <div>
        {organisation && (
          <AvatarComponent
            src={createLogoUrl({ id: organisation.id })}
            alt='team-logo'
            variant='lg'
            onError={(e) => {
              e.currentTarget.src = '/images/avatar-blank.png'
            }}
          />
        )}
      </div>
      <div className='flex flex-col justify-center space-y-1'>
        <h1 className='text-sm font-bold'>{organisation?.name}</h1>
        {organisation?.description && <DescriptionWithDisclouser description={organisation?.description} />}
      </div>
    </div>
  )
}
