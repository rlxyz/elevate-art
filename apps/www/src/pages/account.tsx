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
          <div className='-ml-4 py-8 space-y-8'>
            {
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
            }
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
