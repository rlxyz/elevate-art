import { HeaderInternalPageRoutes } from '@components/layout/core/Header'
import { Layout } from '@components/layout/core/Layout'
import { OrganisationAuthLayout } from '@components/organisation/OrganisationAuthLayout'
import { SettingsNavigations } from '@components/organisation/OrganisationSettings'
import { OrganisationTeamAddUser } from '@components/organisation/OrganisationTeamAddUser'
import { OrganisationTeamDisplayPending } from '@components/organisation/OrganisationTeamDisplayPending'
import { OrganisationTeamDisplayUsers } from '@components/organisation/OrganisationTeamDisplayUsers'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/types/enums'

const Page: NextPage = () => {
  const { setCurrentSettingsRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      setCurrentSettingsRoute: state.setCurrentSettingsRoute,
      currentRoute: state.currentRoute,
    }
  })

  useEffect(() => {
    setCurrentSettingsRoute(OrganisationSettingsNavigationEnum.enum.Team)
  }, [])

  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Settings}>
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
