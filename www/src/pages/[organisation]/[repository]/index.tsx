import Dashboard from '@components/Dashboard/Index'
import { Header } from '@components/Layout/Header'
import { Layout } from '@components/Layout/Layout'
import Loading from '@components/UI/Loading'
import useRepositoryNavigationStore from '@hooks/useRepositoryNavigationStore'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { RepositoryNavigationEnum, RepositorySectionEnum } from 'src/types/enums'

const PageImplementation = ({}) => {
  const setCurrentRoute = useRepositoryNavigationStore((state) => state.setCurrentRoute)
  useEffect(() => {
    setCurrentRoute(RepositoryNavigationEnum.enum.Dashboard)
  }, [])
  return <Dashboard />
}
// wrapper to hydate routes
const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHasHydrated(Boolean(organisationName) && Boolean(repositoryName))
  }, [organisationName, repositoryName])

  return hasHydrated ? (
    <Layout>
      <Layout.Header>
        <Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}` },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
          ]}
          internalNavigation={[
            {
              name: RepositorySectionEnum.enum.Overview,
              href: `/${organisationName}/${repositoryName}`,
              enabled: true,
            },
            // {
            //   name: LayerSectionEnum.enum.Settings,
            //   route: `${LayerSectionEnum.enum.Settings}`,
            // },
          ]}
        />
      </Layout.Header>
      <Layout.Body>
        <PageImplementation />
      </Layout.Body>
    </Layout>
  ) : (
    <Loading />
  )
}

export default Page
