import { Layout } from '@components/Layout/Layout'
import useOrganisationNavigationStore from '@hooks/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'
import { OrganisationNavigationEnum } from 'src/types/enums'

const DynamicViewOrganisation = dynamic(() => import('@components/Views/ViewOrganisation'), { suspense: true })

const Page: NextPage = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  return (
    <>
      <Layout>
        <Layout.Header
          internalRoutes={[{ current: organisationName, href: `/${organisationName}` }]}
          internalNavigation={[
            {
              name: OrganisationNavigationEnum.enum.Dashboard,
              href: `/${organisationName}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
            },
          ]}
        />
        <Layout.Body>
          <DynamicViewOrganisation />
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Page
