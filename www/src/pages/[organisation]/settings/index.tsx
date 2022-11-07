import { Layout } from '@components/Layout/core/Layout'
import { OrganisationAuthLayout } from '@components/Organisation/OrganisationAuthLayout'
import { OrganisationGeneralSettings, SettingsNavigations } from '@components/Organisation/OrganisationSettings'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/types/enums'

const Page: NextPage = () => {
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisation()
  const { setCurrentSettingsRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      setCurrentSettingsRoute: state.setCurrentSettingsRoute,
      currentRoute: state.currentRoute,
    }
  })

  useEffect(() => {
    setCurrentSettingsRoute(OrganisationSettingsNavigationEnum.enum.General)
  }, [])

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Settings}>
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
          internalNavigation={[
            {
              name: OrganisationNavigationEnum.enum.Overview,
              href: `/${organisation?.name}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Overview,
              loading: isLoadingOrganisations,
            },
            {
              name: OrganisationNavigationEnum.enum.Settings,
              href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
              enabled: currentRoute === OrganisationNavigationEnum.enum.Settings,
              loading: isLoadingOrganisations,
            },
          ]}
        />
        <Layout.Body>
          <div className='-ml-4 py-8 space-y-8'>
            {
              <div className='grid grid-cols-10 gap-x-6'>
                <div className='col-span-2'>
                  <SettingsNavigations />
                </div>
                <div className='col-span-8'>
                  <div className='space-y-6'>
                    <OrganisationGeneralSettings />
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
