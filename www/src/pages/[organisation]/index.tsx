import { Layout } from '@components/Layout/Layout'
import ViewAllRepositories from '@components/Organisation/OrganisationViewAllRepository'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { trpc } from '@utils/trpc'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const Page: NextPage = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  const reset = useRepositoryStore((state) => state.reset)
  const { all: organisations, isLoading } = useQueryOrganisation()
  const { data: repositories } = trpc.useQuery(['repository.getAllRepositoriesByOrganisationName', { name: organisationName }])
  const setCurrentRoute = useOrganisationNavigationStore((state) => state.setCurrentRoute)
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Dashboard)
  }, [])

  useEffect(() => {
    reset()
  }, [])

  return (
    <>
      <Layout>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current: organisationName,
              href: `/${organisationName}`,
              organisations,
            },
          ]}
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
          <div className='py-8 space-y-8'>{repositories && <ViewAllRepositories />}</div>
        </Layout.Body>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const organisationName = context.query.organisation as string
  const session = await getSession(context)
  const user = session?.user ?? null
  if (!user) return { redirect: { destination: `/`, permanent: true } }
  return {
    props: {
      session,
      organisationName,
    },
  }
}

export default Page
