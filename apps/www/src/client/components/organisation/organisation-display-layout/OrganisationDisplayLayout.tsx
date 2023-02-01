import { LayoutContainer } from '@components/layout/core/Layout'
import { HomeIcon } from '@heroicons/react/solid'
import type { Organisation, Repository } from '@prisma/client'
import { OrganisationDisplayBody } from './OrganisationDisplayBody'
import { OrganisationDisplayDetails } from './OrganisationDisplayDetails'
import { OrganisationDisplayHeader } from './OrganisationDisplayHeader'

export const OrganisationDisplayLayout = ({
  organisation,
  repositories,
}: {
  organisation: Organisation | undefined | null
  repositories: Repository[] | undefined | null
}) => {
  return (
    <>
      <div className='w-screen space-y-6 pb-12'>
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
