import { OrganisationAuthLayout } from '@components/Layout/core/AuthLayout'
import { Layout } from '@components/Layout/core/Layout'
import { PersonalOrganisationAccountNavigation } from '@components/Organisation/PersonalOrganisationAccountNavigation'
import { OrganisationDatabaseEnum } from '@elevateart/db'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useSession } from 'next-auth/react'
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
  const { data: session } = useSession()
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
          <div className='-ml-4 py-8 space-y-8'>
            {
              <div className='grid grid-cols-10 gap-x-6'>
                <div className='col-span-2'>
                  <PersonalOrganisationAccountNavigation />
                </div>
                <div className='col-span-8'>
                  <div className='space-y-1'>
                    <span className='text-sm font-semibold'>We intend to implement this page soon</span>
                    <p className='text-xs text-darkGrey'>
                      Hopefully the universe doesnt collapse into a black hole in the meantime
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
