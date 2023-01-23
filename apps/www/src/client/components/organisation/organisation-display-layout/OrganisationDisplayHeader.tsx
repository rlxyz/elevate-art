import { CollectionSocialMediaLinks } from '@components/explore/CollectionLayout/CollectionSocialMediaLinks'
import { BannerDisplay } from '@components/layout/BannerDisplay'
import NextLinkComponent from '@components/layout/link/NextLink'
import type { Organisation } from '@prisma/client'
import { ZoneNavigationEnum } from '@utils/enums'
import { routeBuilder } from 'src/client/utils/format'
import { OrganisationDisplayProfile } from './OrganisationDisplayProfile'

export const OrganisationDisplayHeader = ({ organisation }: { organisation: Organisation | undefined | null }) => {
  return (
    <div className='space-y-16'>
      <div className='w-full flex justify-between items-center'>
        <div className='w-1/2'>
          <OrganisationDisplayProfile organisation={organisation} />
        </div>
        <div className='flex flex-col'>
          <CollectionSocialMediaLinks
            discordUrl={organisation?.discordUrl}
            twitterUrl={organisation?.twitterUrl}
            instagramUrl={organisation?.instagramUrl}
          />
          <NextLinkComponent href={routeBuilder(organisation?.name, ZoneNavigationEnum.enum.Create)}>
            <span className='text-xs border p-2 rounded-[5px] bg-blueHighlight text-white border-mediumGrey'>Admin View</span>
          </NextLinkComponent>
        </div>
      </div>
      <BannerDisplay id={organisation?.id} />
    </div>
  )
}
