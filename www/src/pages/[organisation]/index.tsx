import Dashboard from '@components/Dashboard/Index'
import { Header } from '@components/Layout/Header'
import { Layout } from '@components/Layout/Layout'
import useOrganisationNavigationStore from '@hooks/useDashboardNavigation'
import type { NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const PageImplementation = ({}) => {
  const setCurrentRoute = useOrganisationNavigationStore((state) => state.setCurrentRoute)
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Dashboard)
  }, [])
  return <Dashboard />
}

const Page: NextPage = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  return (
    <>
      <Layout>
        <Layout.Header>
          <Header
            internalRoutes={[{ current: organisationName, href: `/${organisationName}` }]}
            internalNavigation={[
              {
                name: OrganisationNavigationEnum.enum.Dashboard,
                href: `/${organisationName}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
              },
              // {
              //   name: DashboardNavigationEnum.enum.Activity,
              //   href: `/dashboard/activity`,
              //   enabled: currentRoute === DashboardNavigationEnum.enum.Activity,
              // },
              // {
              //   name: DashboardNavigationEnum.enum.Settings,
              //   href: `/account`,
              //   enabled: currentRoute === DashboardNavigationEnum.enum.Settings,
              // },
            ]}
          />
        </Layout.Header>
        <Layout.Body>
          <PageImplementation />
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Page
