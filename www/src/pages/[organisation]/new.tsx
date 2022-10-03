import { OrganisationAuthLayout } from '@components/Layout/AuthLayout'
import { Layout } from '@components/Layout/Layout'
import CreateNewRepository from '@components/Organisation/OrganisationCreateNewRepository'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/types/enums'
const Page: NextPage = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const { all: organisations, current: organisation, isLoading } = useQueryOrganisation()
  const { setCurrentRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      setCurrentRoute: state.setCurrentRoute,
      currentRoute: state.currentRoute,
    }
  })
  const { isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()
  const { data: session } = useSession()
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.New)
  }, [])
  return (
    <OrganisationAuthLayout>
      <Layout hasFooter={false}>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current:
                organisation?.type === OrganisationDatabaseEnum.enum.Team ? organisation?.name : session?.user?.address || '',
              href: `/${organisation?.name}`,
              organisations,
            },
          ]}
        />
        <Layout.Body>
          <CreateNewRepository />
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
