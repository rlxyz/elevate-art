import { Layout } from '@components/Layout/Layout'
import Loading from '@components/UI/Loading'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { RepositorySectionEnum } from 'src/types/enums'

const DynamicViewRepository = dynamic(() => import('@components/Views/ViewRepository'), { suspense: true })

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
      <Layout.Header
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
        ]}
      />
      <Layout.Body>
        <DynamicViewRepository />
      </Layout.Body>
    </Layout>
  ) : (
    <Loading />
  )
}

export default Page
