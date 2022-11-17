import { Layout } from '@components/Layout/core/Layout'
import { OrganisationAuthLayout } from '@components/Organisation/OrganisationAuthLayout'
import { PersonalOrganisationAccountTeam } from '@components/Organisation/PersonalOrganisationAccountTeam'
import { PersonalOrganisationAccountTeamInvites } from '@components/Organisation/PersonalOrganisationAccountTeamInvites'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/types/enums'

const Page: NextPage = () => {
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  return (
    <OrganisationAuthLayout type={OrganisationDatabaseEnum.enum.Personal} route={OrganisationNavigationEnum.enum.Dashboard}>
      <Layout>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current: OrganisationNavigationEnum.enum.Dashboard,
              href: `/${organisation?.name || ''}`,
              organisations,
            },
          ]}
          internalNavigation={[
            {
              name: OrganisationNavigationEnum.enum.Overview,
              href: `/${OrganisationNavigationEnum.enum.Dashboard}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
              loading: isLoadingOrganisations,
            },
            {
              name: OrganisationNavigationEnum.enum.Account,
              href: `/${OrganisationNavigationEnum.enum.Account}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
              loading: isLoadingOrganisations,
            },
          ]}
        />
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <div className='space-y-9'>
              <PersonalOrganisationAccountTeam />
              <PersonalOrganisationAccountTeamInvites />
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
