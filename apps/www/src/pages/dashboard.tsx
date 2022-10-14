import { OrganisationAuthLayout } from '@components/Layout/core/AuthLayout'
import { Layout } from '@components/Layout/core/Layout'
import { PersonalOrganisationAccountTeam } from '@components/Organisation/PersonalOrganisationAccountTeam'
import { PersonalOrganisationAccountTeamInvites } from '@components/Organisation/PersonalOrganisationAccountTeamInvites'
import { OrganisationDatabaseEnum } from '@elevateart/db/enums'
import { useSession } from '@elevateart/ui-eth-auth'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const Page: NextPage = () => {
  const { currentRoute, setCurrentRoute } = useOrganisationNavigationStore((state) => {
    return {
      organisationId: state.organisationId,
      setOrganisationId: state.setOrganisationId,
      setCurrentRoute: state.setCurrentRoute,
      currentRoute: state.currentRoute,
    }
  })
  const { data: session } = useSession()
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()

  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Dashboard)
  }, [])

  return (
    <OrganisationAuthLayout type={OrganisationDatabaseEnum.enum.Personal}>
      <Layout>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current: OrganisationNavigationEnum.enum.Dashboard,
              href: `/${organisation?.name || ''}`,
              organisations,
            },
          ]}
          internalNavigation={[
            {
              name: OrganisationNavigationEnum.enum.Overview,
              href: `/${OrganisationNavigationEnum.enum.Dashboard}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
              loading: isLoadingOrganisations,
            },
            {
              name: OrganisationNavigationEnum.enum.Account,
              href: `/${OrganisationNavigationEnum.enum.Account}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
              loading: isLoadingOrganisations,
            },
          ]}
        />
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <div className='space-y-9'>
              <PersonalOrganisationAccountTeam />
              <PersonalOrganisationAccountTeamInvites />
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
