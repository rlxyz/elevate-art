import { Layout } from '@components/Layout/Layout'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'

const DynamicCreateNewCollection = dynamic(() => import('@components/Views/CreateNewCollection'), {
  ssr: false,
  suspense: true,
})

const Page: NextPage = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  return (
    <>
      <Layout hasFooter={false}>
        <Layout.Header internalRoutes={[{ current: organisationName, href: `/${organisationName}` }]} />
        <Layout.Body>
          <DynamicCreateNewCollection />
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Page
