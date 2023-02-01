import { BannerDisplay } from '@components/layout/BannerDisplay'
import { LayoutContainer } from '@components/layout/core/Layout'
import { LogoDisplay } from '@components/layout/LogoDisplay'
import { Organisation } from '@prisma/client'

export const OrganisationDisplayHeader = ({ organisation }: { organisation: Organisation | null | undefined }) => {
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
