import { CollectionSocialMediaLinks } from '@components/explore/CollectionLayout/CollectionSocialMediaLinks'
import { LayoutContainer } from '@components/layout/core/Layout'
import { OrganisationDescriptionWithDisclouser } from '@components/layout/DescriptionWithDisclouser'
import NextLinkComponent from '@components/layout/link/NextLink'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { Organisation } from '@prisma/client'
import { ZoneNavigationEnum } from '@utils/enums'
import { useSession } from 'next-auth/react'
import { routeBuilder } from 'src/client/utils/format'

export const OrganisationDisplayDetails = ({ organisation }: { organisation: Organisation | null | undefined }) => {
  const { status, data } = useSession()
  const { current } = useQueryOrganisationFindAll()

  return (
    <div className='space-y-9'>
      <LayoutContainer border='none'>
        <div className='space-y-6 flex justify-between items-start'>
          <OrganisationDescriptionWithDisclouser organisation={organisation} />
          <div className='flex space-x-3'>
            <NextLinkComponent
              block={true}
              href={routeBuilder(organisation?.name, ZoneNavigationEnum.enum.Create)}
              className='rounded-full bg-mediumGrey/50 px-4 py-2 hover:bg-mediumGrey'
            >
              Admin
            </NextLinkComponent>

            <CollectionSocialMediaLinks
              discordUrl={'https://discord.gg/dreamlab'}
              twitterUrl={'https://twitter.com/jacobriglin'}
              instagramUrl={'https://instagram.com/jacob'}
            />
          </div>
        </div>
      </LayoutContainer>
    </div>
  )
}
