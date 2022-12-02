import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import {
  OrganisationDeleteTeam,
  OrganisationGeneralSettings,
  OrganisationLeaveTeam,
  SettingsNavigations,
} from 'src/client/components/organisation/OrganisationSettings'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/shared/enums'

const Page: NextPage = () => {
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisationFindAll()
  const { setCurrentSettingsRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      setCurrentSettingsRoute: state.setCurrentSettingsRoute,
      currentRoute: state.currentRoute,
    }
  })

  useEffect(() => {
    setCurrentSettingsRoute(OrganisationSettingsNavigationEnum.enum.General)
  }, [])

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
                    <OrganisationGeneralSettings />
                    <OrganisationLeaveTeam />
                    <OrganisationDeleteTeam />
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

export default withOrganisationStore(Page)
