import AppRoutesNavbar from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { OrganisationAuthLayout } from '@components/organisation/OrganisationAuthLayout'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { NextPage } from 'next'
import { Layout } from 'src/client/components/layout/core/Layout'
import ViewAllRepositories from 'src/client/components/organisation/OrganisationViewAllRepository'
import { routeBuilder } from 'src/client/utils/format'
import { DashboardNavigationEnum, OrganisationNavigationEnum } from 'src/shared/enums'

const Page: NextPage = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Overview}>
      <Layout>
        <Layout.AppHeader>
          <AppRoutesNavbar>
            <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)}>
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: OrganisationNavigationEnum.enum.Overview,
                href: routeBuilder(organisation?.name),
                enabled: true,
                loading: false,
              },
              {
                name: DashboardNavigationEnum.enum.Account,
                href: routeBuilder(organisation?.name, OrganisationNavigationEnum.enum.Settings),
                enabled: false,
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <ViewAllRepositories />
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
