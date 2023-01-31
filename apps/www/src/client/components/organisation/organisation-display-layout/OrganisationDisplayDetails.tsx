import { CollectionSocialMediaLinks } from '@components/explore/CollectionLayout/CollectionSocialMediaLinks'
import { LayoutContainer } from '@components/layout/core/Layout'
import { OrganisationDescriptionWithDisclouser } from '@components/layout/DescriptionWithDisclouser'
import type { Organisation } from '@prisma/client'

export const OrganisationDisplayDetails = ({ organisation }: { organisation: Organisation | null | undefined }) => {
  return (
    <div className='space-y-9'>
      <LayoutContainer border='none'>
        <div className='space-y-6 flex justify-between items-start'>
          <OrganisationDescriptionWithDisclouser organisation={organisation} />
          <CollectionSocialMediaLinks
            discordUrl={'https://discord.gg/dreamlab'}
            twitterUrl={'https://twitter.com/jacobriglin'}
            instagramUrl={'https://instagram.com/jacob'}
          />
        </div>
      </LayoutContainer>
    </div>
  )
}
