import { Layout } from '@components/Layout/Layout'
import { AccountNavigation } from '@components/Organisation/OrganisationSettings'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/types/enums'

type OrganisationPageProp = {
  userId: string
  organisationId: string
}

const Page: NextPage<OrganisationPageProp> = ({ organisationId, userId }) => {
  const reset = useRepositoryStore((state) => state.reset)
  const { setOrganisationId, setCurrentSettingsRoute, setCurrentRoute, currentRoute } = useOrganisationNavigationStore(
    (state) => {
      return {
        organisationId: state.organisationId,
        setOrganisationId: state.setOrganisationId,
        setCurrentSettingsRoute: state.setCurrentSettingsRoute,
        setCurrentRoute: state.setCurrentRoute,
        currentRoute: state.currentRoute,
      }
    }
  )

  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Account)
    setCurrentSettingsRoute(OrganisationSettingsNavigationEnum.enum.Teams)
    reset()
    setHasMounted(true)
    setOrganisationId(organisationId)
  }, [organisationId])

  const [hasMounted, setHasMounted] = useState(false)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { all: repositories, isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()
  const isLoading = isLoadingOrganisations && isLoadingRepositories

  return (
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
        <div className='-ml-4 py-8 space-y-8'>
          {
            <div className='grid grid-cols-10 gap-x-6'>
              <div className='col-span-2'>
                <AccountNavigation />
              </div>
              <div className='col-span-8'>
                <div className='space-y-6'>Hi</div>
              </div>
            </div>
          }
        </div>
      </Layout.Body>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const organisationName = context.query.organisation as string
  const session = await getSession(context)
  const user = session?.user ?? null
  if (!user) return { redirect: { destination: `/`, permanent: true } }
  const admin = await prisma?.organisationAdmin.findFirst({
    where: { organisation: { name: organisationName, type: OrganisationDatabaseEnum.enum.Personal }, user: { id: user.id } },
    select: { organisationId: true },
  })
  if (!admin) return { redirect: { destination: `/`, permanent: true } }
  return {
    props: { organisationId: admin.organisationId, userId: user.id },
  }
}

export default Page
