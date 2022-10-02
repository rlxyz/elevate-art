import { Layout } from '@components/Layout/Layout'
import ViewAllRepositories from '@components/Organisation/OrganisationViewAllRepository'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/types/enums'
import { AuthLayout } from '../../components/Layout/AuthLayout'

const Page: NextPage = () => {
  const { currentRoute, setCurrentRoute } = useOrganisationNavigationStore((state) => {
    return {
      organisationId: state.organisationId,
      setOrganisationId: state.setOrganisationId,
      setCurrentRoute: state.setCurrentRoute,
      currentRoute: state.currentRoute,
    }
  })
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()

  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Dashboard)
  }, [])

  return (
    <AuthLayout>
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
          internalNavigation={
            organisation?.type === OrganisationDatabaseEnum.enum.Team
              ? [
                  {
                    name: OrganisationNavigationEnum.enum.Dashboard,
                    href: `/${organisation?.name}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
                    loading: isLoadingOrganisations,
                  },
                  {
                    name: OrganisationNavigationEnum.enum.Settings,
                    href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Settings,
                    loading: isLoadingOrganisations,
                  },
                ]
              : [
                  {
                    name: OrganisationNavigationEnum.enum.Dashboard,
                    href: `/${organisation?.name}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
                    loading: isLoadingOrganisations,
                  },
                  {
                    name: OrganisationNavigationEnum.enum.Account,
                    href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Account}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
                    loading: isLoadingOrganisations,
                  },
                ]
          }
        />
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <ViewAllRepositories />
          </div>
        </Layout.Body>
      </Layout>
    </AuthLayout>
  )
}

export default Page
