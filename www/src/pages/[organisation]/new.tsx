import { Layout } from '@components/Layout/Layout'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'
const DynamicCreateNewRepository = dynamic(() => import('@components/Views/CreateNewRepository'), {
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
          <DynamicCreateNewRepository />
        </Layout.Body>
      </Layout>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { organisation } = context.query
//   const session = await getSession(context)
//   const token = await getToken({ req: context.req })
//   const userId = token?.sub ?? null
//   if (!userId) return { redirect: { destination: '/404', permanent: false } }
//   const data = await prisma.organisation.findFirst({
//     where: { name: organisation as string, admins: { some: { userId: userId } } },
//   })
//   if (!data) return { redirect: { destination: `/404`, permanent: false } }
//   return { props: { userId, session } }
// }

export default Page
