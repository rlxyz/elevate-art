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
          <div className='flex space-x-3'>
            <CollectionSocialMediaLinks
              discordUrl={'https://discord.gg/XJeAm63cj2'}
              twitterUrl={'https://twitter.com/jacobriglin'}
              instagramUrl={'https://instagram.com/jacob'}
            />
            {/* {organisation && <OrganisationMenuNavigation organisation={organisation} />} */}
          </div>
        </div>
      </LayoutContainer>
    </div>
  )
}
