import { RulesDisplay } from '@components/create/repository/RulesDisplay'
import { RulesSelector } from '@components/create/repository/RulesSelector'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon } from '@heroicons/react/outline'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { CollectionNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

const Page = () => {
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { current: organisation } = useQueryOrganisationFindAll()
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  return (
    <OrganisationAuthLayout>
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
            />
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
                enabled: true,
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
                enabled: false,
                loading: !organisation?.name || !repository?.name,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body border='lower'>
          <div className='w-full py-16'>
            <div className='flex justify-center'>
              <div className='space-y-1 w-full'>
                <span className='text-xs font-semibold uppercase'>Create a condition</span>
                <RulesSelector layers={layers} />
              </div>
            </div>
          </div>
          <div className='w-full py-16'>
            <div className='space-y-3 w-full flex flex-col justify-center'>
              <span className='text-xs font-semibold uppercase'>All rules created</span>
              <RulesDisplay traitElements={layers.flatMap((x) => x.traitElements)} />
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
