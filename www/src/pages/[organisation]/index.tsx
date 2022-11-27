import { useQueryOrganisationFindAll } from '@hooks/router/organisation/useQueryOrganisationFindAll'
import type { NextPage } from 'next'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import ViewAllRepositories from 'src/client/components/organisation/OrganisationViewAllRepository'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { OrganisationNavigationEnum } from 'src/shared/enums'
import { OrganisationAuthLayout } from '../../client/components/organisation/OrganisationAuthLayout'

const Page: NextPage = () => {
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisationFindAll()

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Overview}>
      <Layout>
        <Layout.Header
          internalRoutes={[
            {
              current: organisation?.name || '',
              href: `/${organisation?.name}`,
              organisations,
            },
          ]}
        >
          <HeaderInternalPageRoutes
            links={[
              {
                name: OrganisationNavigationEnum.enum.Overview,
                href: `/${organisation?.name}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Overview,
                loading: isLoadingOrganisations,
              },
              {
                name: OrganisationNavigationEnum.enum.Settings,
                href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Settings,
                loading: isLoadingOrganisations,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <ViewAllRepositories />
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
