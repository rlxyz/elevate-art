import AppRoutesNavbar from '@components/layout/header/AppRoutesNavbarProps'
import { OrganisationDisplayLayout } from '@components/organisation/organisation-display-layout/OrganisationDisplayLayout'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import { useQueryOrganisationFindAllRepositoryProduction } from '@hooks/trpc/organisation/useQueryOrganisationFindAllRepositoryProduction'
import { useQueryOrganisationFindByName } from '@hooks/trpc/organisation/useQueryOrganisationFindByName'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Layout } from 'src/client/components/layout/core/Layout'
import { routeBuilder } from 'src/client/utils/format'

const Page: NextPage = () => {
  const router = useRouter()
  const { organisation: o } = router.query as { organisation: string }
  const { current: organisation } = useQueryOrganisationFindByName({ organisationName: o })
  const { all: repositories } = useQueryOrganisationFindAllRepositoryProduction({ organisationName: o })
  return (
    <Layout>
      <Layout.AppHeader border='lower'>
        <AppRoutesNavbar>
          <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)}>
            <OrganisationRoutesNavbarPopover />
          </AppRoutesNavbar.Item>
        </AppRoutesNavbar>
      </Layout.AppHeader>
      <Layout.Body>
        <OrganisationDisplayLayout organisation={organisation} repositories={repositories} />
      </Layout.Body>
    </Layout>
  )
}

export default Page
