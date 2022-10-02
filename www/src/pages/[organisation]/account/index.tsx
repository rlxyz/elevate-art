import { AuthLayout } from '@components/Layout/AuthLayout'
import { Layout } from '@components/Layout/Layout'
import { AccountNavigation } from '@components/Organisation/OrganisationSettings'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useEffect } from 'react'
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
    setCurrentSettingsRoute(OrganisationSettingsNavigationEnum.enum.General)
  }, [])

  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { all: repositories, isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()

  return (
    <AuthLayout>
      <Layout>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current: organisation?.name || '',
              href: `/${organisation?.name || ''}`,
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
                  <div className='space-y-1'>
                    <span className='text-sm font-semibold'>We intent to implement this page soon.</span>
                    <p className='text-xs text-darkGrey'>
                      If the universe doesn't become a black hole in the meantime, you will be able to set a username.
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        </Layout.Body>
      </Layout>
    </AuthLayout>
  )
}

export default Page
