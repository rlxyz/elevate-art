import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { NextPage } from 'next'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { PersonalOrganisationAccountTeam } from 'src/client/components/organisation/PersonalOrganisationAccountTeam'
import { PersonalOrganisationAccountTeamInvites } from 'src/client/components/organisation/PersonalOrganisationAccountTeamInvites'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/shared/enums'

const Page: NextPage = () => {
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisationFindAll()

  return (
    <OrganisationAuthLayout type={OrganisationDatabaseEnum.enum.Personal} route={OrganisationNavigationEnum.enum.Dashboard}>
      <Layout>
        <Layout.Header
          internalRoutes={[
            {
              current: OrganisationNavigationEnum.enum.Dashboard,
              href: `/${organisation?.name || ''}`,
              organisations,
            },
          ]}
        >
          <HeaderInternalPageRoutes
            links={[
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
        </Layout.Header>
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
