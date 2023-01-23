import AppRoutesNavbar from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { SettingNavigation } from '@components/layout/settings/SettingNavigation'
import { OrganisationBannerImageForm } from '@components/organisation/organisation-setting/OrganisationBannerImageForm'
import { OrganisationDescriptionForm } from '@components/organisation/organisation-setting/OrganisationDescriptionForm'
import { OrganisationLogoImageForm } from '@components/organisation/organisation-setting/OrganisationLogoImageForm'
import { OrganisationNameForm } from '@components/organisation/organisation-setting/OrganisationNameForm'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { NextPage } from 'next'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { routeBuilder } from 'src/client/utils/format'
import {
  DashboardNavigationEnum,
  OrganisationNavigationEnum,
  OrganisationSettingsNavigationEnum,
  ZoneNavigationEnum,
} from 'src/shared/enums'

const Page: NextPage = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Settings}>
      <Layout>
        <Layout.AppHeader>
          <AppRoutesNavbar>
            <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)}>
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: OrganisationNavigationEnum.enum.Overview,
                href: routeBuilder(organisation?.name, ZoneNavigationEnum.enum.Create),
                enabled: false,
                loading: false,
              },
              {
                name: DashboardNavigationEnum.enum.Account,
                href: routeBuilder(organisation?.name, OrganisationNavigationEnum.enum.Settings),
                enabled: true,
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <div className='grid grid-cols-10 gap-x-6'>
              <div className='col-span-2'>
                <SettingNavigation
                  routes={[
                    {
                      name: OrganisationSettingsNavigationEnum.enum.General,
                      href: routeBuilder(organisation?.name, OrganisationNavigationEnum.enum.Settings),
                      selected: true,
                    },
                    {
                      name: OrganisationSettingsNavigationEnum.enum.Team,
                      href: routeBuilder(
                        organisation?.name,
                        OrganisationNavigationEnum.enum.Settings,
                        OrganisationSettingsNavigationEnum.enum.Team
                      ),
                      selected: false,
                    },
                  ]}
                />
              </div>
              <div className='col-span-8'>
                <div className='space-y-6'>
                  <OrganisationNameForm />
                  <OrganisationDescriptionForm />
                  <OrganisationLogoImageForm />
                  <OrganisationBannerImageForm />
                </div>
              </div>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
