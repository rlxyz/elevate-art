import { HeaderInternalPageRoutes } from '@components/layout/core/Header'
import { Layout } from '@components/layout/core/Layout'
import { OrganisationAuthLayout } from '@components/organisation/OrganisationAuthLayout'
import { PersonalOrganisationAccountNavigation } from '@components/organisation/PersonalOrganisationAccountNavigation'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/types/enums'

const Page = () => {
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  return (
    <OrganisationAuthLayout type={OrganisationDatabaseEnum.enum.Personal} route={OrganisationNavigationEnum.enum.Account}>
      <Layout>
        <Layout.Header
          internalRoutes={[
            {
              current: OrganisationNavigationEnum.enum.Dashboard,
              href: `/${organisation?.name || ''}`,
              organisations,
            },
          ]}
        >
          <HeaderInternalPageRoutes
            links={[
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
        </Layout.Header>
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
