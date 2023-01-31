import { CollectionSocialMediaLinks } from '@components/explore/CollectionLayout/CollectionSocialMediaLinks'
import { BannerDisplay } from '@components/layout/BannerDisplay'
import { LayoutContainer } from '@components/layout/core/Layout'
import { DescriptionWithDisclouser } from '@components/layout/DescriptionWithDisclouser'
import { LogoDisplay } from '@components/layout/LogoDisplay'
import { HomeIcon } from '@heroicons/react/solid'
import type { Organisation, Repository } from '@prisma/client'
import { OrganisationDisplayBody } from './OrganisationDisplayBody'

export const OrganisationDisplayLayout = ({
  organisation,
  repositories,
}: {
  organisation: Organisation | undefined | null
  repositories: Repository[] | undefined | null
}) => {
  return (
    <>
      <div className='w-screen space-y-6'>
        <OrganisationDisplayHeader organisation={organisation} />
        <OrganisationDisplayDetails organisation={organisation} />

        <LayoutContainer margin={false} border='none'>
          <div className='w-screen border-b border-t border-lightGray py-3'>
            <LayoutContainer margin border='none'>
              <button className='rounded-full bg-mediumGrey/50 px-4 py-2 hover:bg-mediumGrey'>
                <HomeIcon className='w-6 h-6 text-black' />
              </button>
            </LayoutContainer>
          </div>
        </LayoutContainer>

        <LayoutContainer border='none'>
          <OrganisationDisplayBody organisation={organisation} repositories={repositories} />
        </LayoutContainer>
      </div>
    </>
  )
}

const OrganisationDisplayHeader = ({ organisation }: { organisation: Organisation | null | undefined }) => {
  return (
    <div>
      <div className='overflow-hidden'>
        <BannerDisplay id={organisation?.id} />
      </div>
      <LayoutContainer border='none'>
        <LogoDisplay repositoryId={organisation?.id} />
      </LayoutContainer>
    </div>
  )
}

const OrganisationDisplayDetails = ({ organisation }: { organisation: Organisation | null | undefined }) => {
  return (
    <div className='space-y-9'>
      <LayoutContainer border='none'>
        <div className='space-y-6 flex justify-between items-start'>
          <DescriptionWithDisclouser organisation={organisation} />
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
