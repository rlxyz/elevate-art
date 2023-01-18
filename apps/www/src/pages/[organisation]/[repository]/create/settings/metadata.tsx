import { RepositoryArtistForm } from '@components/create/repository-setting/RepositoryArtistForm'
import { RepositoryExternalUrlForm } from '@components/create/repository-setting/RepositoryExternalUrlForm'
import { RepositoryLicenseForm } from '@components/create/repository-setting/RepositoryLicenseForm'
import { RepositoryTokenNameForm } from '@components/create/repository-setting/RepositoryTokenNameForm'
import { FilterWithTextLive } from '@components/layout/FilterWithTextLive'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { SettingNavigation } from '@components/layout/settings/SettingNavigation'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon } from '@heroicons/react/outline'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryHasProductionDeployment } from '@hooks/trpc/repository/useQueryRepositoryHasProductionDeployment'
import type { NextPage } from 'next'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import {
  CollectionNavigationEnum,
  OrganisationNavigationEnum,
  RepositorySettingsNavigationEnum,
  ZoneNavigationEnum,
} from 'src/shared/enums'

const Page: NextPage = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const { current: repository } = useQueryRepositoryFindByName()
  const { current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { current: hasProductionDeployment } = useQueryRepositoryHasProductionDeployment()
  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Settings}>
      <Layout>
        <Layout.AppHeader>
          <AppRoutesNavbar>
            <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)} loading={!organisation?.name}>
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={repository?.name || ''}
              href={routeBuilder(organisation?.name, repository?.name)}
              loading={!organisation?.name || !repository?.name}
              disabled={!hasProductionDeployment}
            >
              <FilterWithTextLive />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={capitalize(ZoneNavigationEnum.enum.Create)}
              href={routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Create)}
            >
              <ZoneRoutesNavbarPopover
                title='Apps'
                routes={[
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Create),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Create),
                    selected: true,
                    icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Deployments),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments),
                    selected: false,
                    icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                  },
                ]}
              />
            </AppRoutesNavbar.Item>
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: CollectionNavigationEnum.enum.Preview,
                href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Create),
                enabled: false,
                loading: !organisation?.name || !repository?.name,
              },
              {
                name: CollectionNavigationEnum.enum.Rarity,
                href: routeBuilder(
                  organisation?.name,
                  repository?.name,
                  ZoneNavigationEnum.enum.Create,
                  CollectionNavigationEnum.enum.Rarity,
                  layer?.name
                ),
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rules,
                href: routeBuilder(
                  organisation?.name,
                  repository?.name,
                  ZoneNavigationEnum.enum.Create,
                  CollectionNavigationEnum.enum.Rules
                ),
                enabled: false,
                loading: !organisation?.name || !repository?.name,
              },
              {
                name: CollectionNavigationEnum.enum.Settings,
                href: routeBuilder(
                  organisation?.name,
                  repository?.name,
                  ZoneNavigationEnum.enum.Create,
                  CollectionNavigationEnum.enum.Settings
                ),
                enabled: true,
                loading: !organisation?.name || !repository?.name,
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
                      name: RepositorySettingsNavigationEnum.enum.General,
                      href: routeBuilder(
                        organisation?.name,
                        repository?.name,
                        ZoneNavigationEnum.enum.Create,
                        CollectionNavigationEnum.enum.Settings
                      ),
                      selected: false,
                      disabled: !organisation?.name || !repository?.name,
                    },
                    {
                      name: RepositorySettingsNavigationEnum.enum.Metadata,
                      href: routeBuilder(
                        organisation?.name,
                        repository?.name,
                        ZoneNavigationEnum.enum.Create,
                        CollectionNavigationEnum.enum.Settings,
                        RepositorySettingsNavigationEnum.enum.Metadata
                      ),
                      selected: true,
                      disabled: !organisation?.name || !repository?.name,
                    },
                  ]}
                />
              </div>
              <div className='col-span-8'>
                <div className='space-y-6'>
                  <RepositoryTokenNameForm />
                  <RepositoryArtistForm />
                  <RepositoryExternalUrlForm />
                  <RepositoryLicenseForm />
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
