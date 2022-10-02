import { Layout } from '@components/Layout/Layout'
import ViewAllRepositories from '@components/Organisation/OrganisationViewAllRepository'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useAuthenticated } from '@hooks/utils/useAuthenticated'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/types/enums'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuthenticated()
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const { all: organisations, isLoading } = useQueryOrganisation()
  const { setOrganisationId, setCurrentRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      organisationId: state.organisationId,
      setOrganisationId: state.setOrganisationId,
      setCurrentRoute: state.setCurrentRoute,
      currentRoute: state.currentRoute,
    }
  })
  useEffect(() => {
    if (isLoading) {
      return
    }
    const organisation = organisations?.find((organisation) => organisation.name === organisationName)
    if (!organisation) {
      router.push('/')
      return
    }
    setOrganisationId(organisation.id)
  }, [isLoading])

  useEffect(() => {
    if (!organisationName) {
      router.push('/404')
      return
    }
    setCurrentRoute(OrganisationNavigationEnum.enum.Dashboard)
  }, [organisationName])

  if (isLoggedIn) {
    return <>{children}</>
  }

  return null
}

const Page: NextPage = () => {
  const reset = useRepositoryStore((state) => state.reset)
  const { setOrganisationId, setCurrentRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      organisationId: state.organisationId,
      setOrganisationId: state.setOrganisationId,
      setCurrentRoute: state.setCurrentRoute,
      currentRoute: state.currentRoute,
    }
  })

  const [hasMounted, setHasMounted] = useState(false)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { all: repositories, isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()
  const isLoading = isLoadingOrganisations && isLoadingRepositories

  return (
    <AuthLayout>
      <Layout>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current: organisation?.name || '',
              href: `/${organisation?.name}`,
              organisations,
            },
          ]}
          internalNavigation={
            organisation?.type === OrganisationDatabaseEnum.enum.Team
              ? [
                  {
                    name: OrganisationNavigationEnum.enum.Dashboard,
                    href: `/${organisation?.name}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
                    loading: false,
                  },
                  {
                    name: OrganisationNavigationEnum.enum.Settings,
                    href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Settings,
                    loading: false,
                  },
                ]
              : [
                  {
                    name: OrganisationNavigationEnum.enum.Dashboard,
                    href: `/${organisation?.name}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
                    loading: false,
                  },
                  {
                    name: OrganisationNavigationEnum.enum.Account,
                    href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Account}`,
                    enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
                    loading: false,
                  },
                ]
          }
        />
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <ViewAllRepositories />
          </div>
        </Layout.Body>
      </Layout>
    </AuthLayout>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const organisationName = context.query.organisation as string
//   const session = await getSession(context)
//   const user = session?.user ?? null
//   if (!user) return { redirect: { destination: `/`, permanent: true } }
//   const admin = await prisma?.organisationMember.findFirst({
//     where: { organisation: { name: organisationName }, user: { id: user.id } },
//     select: { organisationId: true },
//   })
//   if (!admin) return { redirect: { destination: `/`, permanent: true } }
//   return {
//     props: { organisationId: admin.organisationId, userId: user.id },
//   }
// }

export default Page
