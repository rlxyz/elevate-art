import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import LayerElementFileTree from 'src/client/components/repository/LayerElementFileTree'
import TraitTable from 'src/client/components/repository/TraitElementTable'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { CollectionNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

const Page = () => {
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { current: organisation } = useQueryOrganisationFindAll()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
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
            <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)}>
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item label={repository?.name || ''} href={routeBuilder(organisation?.name, repository?.name)} />
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
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Explore),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Explore),
                    selected: false,
                    icon: (props: any) => <GlobeAltIcon className='w-4 h-4' />,
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
                loading: false,
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
                enabled: true,
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
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body border='none'>
          <div className='py-6 grid grid-cols-10 gap-x-6'>
            <LayerElementFileTree className='col-span-2' layerElements={layers} repository={repository} />
            <TraitTable className='col-span-8' layerElement={layer} organisation={organisation} repository={repository} />
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
