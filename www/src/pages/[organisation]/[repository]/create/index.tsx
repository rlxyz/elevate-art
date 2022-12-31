import CollectionBranchSelectorCard from '@components/create/collection/CollectionBranchSelectorCard'
import { GenerateButton } from '@components/create/collection/CollectionGenerateCard'
import CollectionPreviewFilters from '@components/create/collection/CollectionPreviewFilters'
import CollectionPreviewGrid from '@components/create/collection/CollectionPreviewGrid'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { CollectionNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

const Page = () => {
  const { setCollectionId, reset, setRepositoryId } = useRepositoryStore((state) => {
    return {
      setRepositoryId: state.setRepositoryId,
      setCollectionId: state.setCollectionId,
      reset: state.reset,
    }
  })

  useEffect(() => {
    reset()
  }, [])

  const { all: collections, isLoading: isLoadingCollection, mutate } = useQueryCollectionFindAll()
  const { current: organisation } = useQueryOrganisationFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { collectionName } = useRepositoryRoute()

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  useEffect(() => {
    if (!collections) return
    if (!collections.length) return
    const collection = collections.find((collection) => collection.name === collectionName)
    if (!collection) return
    setCollectionId(collection.id)
    // if (tokens.length === 0) return
    mutate({ collection })
  }, [isLoadingCollection])

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
                enabled: true,
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
                loading: false,
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
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body border='none'>
          <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
            <div className='col-span-2 py-8'>
              <div>
                <div className='relative flex flex-col space-y-3 justify-between'>
                  <div className='grid grid-cols-8 gap-x-2 w-full h-full'>
                    <div className='col-span-6'>
                      <CollectionBranchSelectorCard />
                    </div>
                    <div className='col-span-2'>
                      <GenerateButton />
                    </div>
                  </div>
                  <CollectionPreviewFilters />
                </div>
              </div>
            </div>
            <div className='col-span-8'>
              <main className='space-y-6 py-8 pl-8'>
                <CollectionPreviewGrid />
              </main>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
