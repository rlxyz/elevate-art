import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { PersonalOrganisationAccountNavigation } from 'src/client/components/organisation/PersonalOrganisationAccountNavigation'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { env } from 'src/env/client.mjs'
import { OrganisationDatabaseEnum, OrganisationNavigationEnum } from 'src/shared/enums'

const Page = () => {
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisationFindAll()
  return (
    <OrganisationAuthLayout type={OrganisationDatabaseEnum.enum.Personal} route={OrganisationNavigationEnum.enum.Account}>
      <Layout>
        <Layout.Header
          internalRoutes={[
            {
              current: OrganisationNavigationEnum.enum.Dashboard,
              href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name || ''}`,
              organisations,
            },
          ]}
        >
          <PageRoutesNavbar>
            {[
              {
                name: OrganisationNavigationEnum.enum.Overview,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${OrganisationNavigationEnum.enum.Dashboard}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
                loading: isLoadingOrganisations,
              },
              {
                name: OrganisationNavigationEnum.enum.Account,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${OrganisationNavigationEnum.enum.Account}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
                loading: isLoadingOrganisations,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
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
                    <p className='text-xs text-darkGrey'>Hopefully the universe doesnt collapse into a black hole in the meantime</p>
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

export default withOrganisationStore(Page)
