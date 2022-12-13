import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { SettingsNavigations } from 'src/client/components/organisation/OrganisationSettings'
import { OrganisationTeamAddUser } from 'src/client/components/organisation/OrganisationTeamAddUser'
import { OrganisationTeamDisplayPending } from 'src/client/components/organisation/OrganisationTeamDisplayPending'
import { OrganisationTeamDisplayUsers } from 'src/client/components/organisation/OrganisationTeamDisplayUsers'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/shared/enums'

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

  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisationFindAll()

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
          <PageRoutesNavbar>
            {[
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
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
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

export default withOrganisationStore(Page)
