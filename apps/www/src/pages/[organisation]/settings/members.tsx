import { OrganisationAuthLayout } from '@components/Layout/core/AuthLayout'
import { Layout } from '@components/Layout/core/Layout'
import { SettingsNavigations } from '@components/Organisation/OrganisationSettings'
import { OrganisationTeamAddUser } from '@components/Organisation/OrganisationTeamAddUser'
import { OrganisationTeamDisplayPending } from '@components/Organisation/OrganisationTeamDisplayPending'
import { OrganisationTeamDisplayUsers } from '@components/Organisation/OrganisationTeamDisplayUsers'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/types/enums'

const Page: NextPage = () => {
  const reset = useRepositoryStore((state) => state.reset)
  const { setOrganisationId, setCurrentSettingsRoute, setCurrentRoute, currentRoute } = useOrganisationNavigationStore(
    (state) => {
      return {
        organisationId: state.organisationId,
        setOrganisationId: state.setOrganisationId,
        setCurrentSettingsRoute: state.setCurrentSettingsRoute,
        setCurrentRoute: state.setCurrentRoute,
        currentRoute: state.currentRoute,
      }
    }
  )

  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Settings)
    setCurrentSettingsRoute(OrganisationSettingsNavigationEnum.enum.Team)
  }, [])

  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { all: repositories, isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()

  return (
    <OrganisationAuthLayout>
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
          <div className='-ml-4 py-8 space-y-8'>
            {
              <div className='grid grid-cols-10 gap-x-6'>
                <div className='col-span-2'>
                  <SettingsNavigations />
                </div>
                <div className='col-span-8'>
                  <div className='space-y-6'>
                    <OrganisationTeamAddUser />
                    <OrganisationTeamDisplayUsers />
                    <OrganisationTeamDisplayPending />
                  </div>
                </div>
              </div>
            }
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
