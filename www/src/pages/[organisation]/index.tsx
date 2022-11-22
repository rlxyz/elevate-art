import { Layout } from '@components/layout/core/Layout'
import ViewAllRepositories from '@components/organisation/OrganisationViewAllRepository'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import { OrganisationNavigationEnum } from 'src/types/enums'
import { OrganisationAuthLayout } from '../../components/organisation/OrganisationAuthLayout'

const Page: NextPage = () => {
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Overview}>
      <Layout>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current: organisation?.name || '',
              href: `/${organisation?.name}`,
              organisations,
            },
          ]}
          internalNavigation={[
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
