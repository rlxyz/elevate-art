import { Layout } from '@components/Layout/Layout'
import CreateNewRepository from '@components/Organisation/OrganisationCreateNewRepository'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'
const Page: NextPage = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const { all: organisations, isLoading } = useQueryOrganisation()
  const { setCurrentRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      setCurrentRoute: state.setCurrentRoute,
      currentRoute: state.currentRoute,
    }
  })
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.New)
  }, [])
  return (
    <>
      <Layout hasFooter={false}>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current: organisationName,
              href: `/${organisationName}`,
              organisations,
            },
          ]}
        />
        <Layout.Body>
          <CreateNewRepository />
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
