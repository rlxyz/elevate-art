import { Layout } from '@components/Layout/Layout'
import { OrganisationAccountDisplayPendingInvites } from '@components/Organisation/OrganisationAccountDisplayPendingInvites'
import { OrganisationAccountTeam } from '@components/Organisation/OrganisationAccountTeam'
import { AccountNavigation } from '@components/Organisation/OrganisationSettings'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/types/enums'

const Page = () => {
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
  }, [])

  const [hasMounted, setHasMounted] = useState(false)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { all: repositories, isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()
  const isLoading = isLoadingOrganisations && isLoadingRepositories
  const { data: session } = useSession()
  return (
    <Layout>
      <Layout.Header
        connectButton
        internalRoutes={[
          {
            current: session?.user?.address || '',
            href: `/${organisation?.name}`,
            organisations,
          },
        ]}
        internalNavigation={[
          {
            name: OrganisationNavigationEnum.enum.Dashboard,
            href: `/${organisation?.name}`,
            enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
            loading: isLoadingOrganisations,
          },
          {
            name: OrganisationNavigationEnum.enum.Account,
            href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Account}`,
            enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
            loading: isLoadingOrganisations,
          },
        ]}
      />
      <Layout.Body>
        <div className='-ml-4 py-8 space-y-8'>
          {
            <div className='grid grid-cols-10 gap-x-6'>
              <div className='col-span-2'>
                <AccountNavigation />
              </div>
              <div className='col-span-8'>
                <div className='space-y-9'>
                  <OrganisationAccountTeam />
                  <OrganisationAccountDisplayPendingInvites />
                </div>
              </div>
            </div>
          }
        </div>
      </Layout.Body>
    </Layout>
  )
}

export default Page
