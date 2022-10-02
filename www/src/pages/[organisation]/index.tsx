import { Layout } from '@components/Layout/Layout'
import ViewAllRepositories from '@components/Organisation/OrganisationViewAllRepository'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/types/enums'
import { AuthLayout } from '../../components/Layout/AuthLayout'

const Page: NextPage = () => {
  const reset = useRepositoryStore((state) => state.reset)
  const { setOrganisationId, setCurrentRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      organisationId: state.organisationId,
      setOrganisationId: state.setOrganisationId,
      setCurrentRoute: state.setCurrentRoute,
      currentRoute: state.currentRoute,
    }
  })
  const { data: session } = useSession()
  const [hasMounted, setHasMounted] = useState(false)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { all: repositories, isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()
  const isLoading = isLoadingOrganisations && isLoadingRepositories

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
                    loading: false,
                  },
                  {
                    name: OrganisationNavigationEnum.enum.Settings,
                    href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Settings,
                    loading: false,
                  },
                ]
              : [
                  {
                    name: OrganisationNavigationEnum.enum.Dashboard,
                    href: `/${organisation?.name}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
                    loading: false,
                  },
                  {
                    name: OrganisationNavigationEnum.enum.Account,
                    href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Account}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
                    loading: false,
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
