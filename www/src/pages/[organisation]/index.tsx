import { Layout } from '@components/Layout/Layout'
import useOrganisationNavigationStore from '@hooks/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { trpc } from '@utils/trpc'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const DynamicViewOrganisation = dynamic(() => import('@components/Views/ViewOrganisation'), { suspense: true })

const Page: NextPage = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  const reset = useRepositoryStore((state) => state.reset)

  useEffect(() => {
    reset()
  }, [])

  const { data: repositories } = trpc.useQuery(['repository.getAllRepositoriesByOrganisationName', { name: organisationName }])
  return (
    <>
      <Layout>
        <Layout.Header
          connectButton
          internalRoutes={[{ current: organisationName, href: `/${organisationName}` }]}
          internalNavigation={[
            {
              name: OrganisationNavigationEnum.enum.Dashboard,
              href: `/${organisationName}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
              loading: false,
            },
          ]}
        />
        <Layout.Body>
          <div className='py-8 space-y-8'>{repositories && <DynamicViewOrganisation />}</div>
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
