<<<<<<< HEAD:apps/www/src/pages/account.tsx
import { OrganisationAuthLayout } from '@components/Layout/core/AuthLayout'
import { Layout } from '@components/Layout/core/Layout'
import { PersonalOrganisationAccountNavigation } from '@components/Organisation/PersonalOrganisationAccountNavigation'
import { OrganisationDatabaseEnum } from '@elevateart/db/enums'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const Page: NextPage = () => {
  const { currentRoute, setCurrentRoute } = useOrganisationNavigationStore((state) => ({
    setCurrentRoute: state.setCurrentRoute,
    currentRoute: state.currentRoute,
  }))
  const { all: organisations } = useQueryOrganisation()
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.Account)
  }, [])
  return (
    <OrganisationAuthLayout type={OrganisationDatabaseEnum.enum.Personal}>
      <Layout>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current: OrganisationNavigationEnum.enum.Dashboard,
              href: `/${OrganisationNavigationEnum.enum.Dashboard}`,
              organisations,
            },
          ]}
          internalNavigation={[
            {
              name: OrganisationNavigationEnum.enum.Overview,
              href: `/${OrganisationNavigationEnum.enum.Dashboard}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Dashboard,
              loading: false,
            },
            {
              name: OrganisationNavigationEnum.enum.Account,
              href: `/${OrganisationNavigationEnum.enum.Account}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Account,
              loading: false,
            },
          ]}
        />
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <div className='grid grid-cols-10 gap-x-6'>
              <div className='col-span-2'>
                <PersonalOrganisationAccountNavigation />
              </div>
              <div className='col-span-8'>
                <div className='space-y-1'>
                  <span className='text-sm font-semibold'>We intend to implement this page soon</span>
                  <p className='text-xs text-accents_5'>
                    Hopefully the universe doesnt collapse into a black hole in the meantime
                  </p>
                </div>
              </div>
            </div>
=======
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { PersonalOrganisationAccountNavigation } from 'src/client/components/organisation/PersonalOrganisationAccountNavigation'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
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
                    <p className='text-xs text-darkGrey'>Hopefully the universe doesnt collapse into a black hole in the meantime</p>
                  </div>
                </div>
              </div>
            }
>>>>>>> staging:www/src/pages/account.tsx
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

<<<<<<< HEAD:apps/www/src/pages/account.tsx
export default Page
=======
export default withOrganisationStore(Page)
>>>>>>> staging:www/src/pages/account.tsx
