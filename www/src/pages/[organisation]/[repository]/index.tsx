import { Layout } from '@components/layout/core/Layout'
import AppRoutesNavbar from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { OrganisationAuthLayout } from '@components/organisation/OrganisationAuthLayout'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { OrganisationNavigationEnum } from '@utils/enums'
import type { NextPage } from 'next'
import { routeBuilder } from 'src/client/utils/format'

/** @todo currently its a Placeholder */
const Page: NextPage = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const { current: repository } = useQueryRepositoryFindByName()
  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Settings}>
      <Layout>
        <Layout.AppHeader>
          <AppRoutesNavbar>
            <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)}>
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item label={repository?.name || ''} href={routeBuilder(organisation?.name, repository?.name)} />
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
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body>
          <div>Public Page. To be implemented.</div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
