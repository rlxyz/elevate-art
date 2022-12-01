<<<<<<< HEAD:apps/www/src/pages/[organisation]/[repository]/rarity/[layer].tsx
import { OrganisationAuthLayout } from '@components/Layout/core/AuthLayout'
import { Layout } from '@components/Layout/core/Layout'
import LayerFolderSelector from '@components/Repository/RepositoryFolderSelector'
import LayerGridView from '@components/Repository/RepositoryRarityLayer'
import LayerRarityTable from '@components/Repository/RepositoryRarityTable'
import { Search } from '@elevateart/ui'
import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import clsx from 'clsx'
=======src/hooks/store/useRepositoryStore
import withOrganisationStore from '@src/hooks/utils/useRepositoryRoutee'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
>>>>>>> staging:www/src/pages/[organisation]/[repository]/rarity/[layer].tsx
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { HeaderInternalPageRoutes } from 'src/components/layout/core/Header'
import LayerElementFileTree from 'src/components/repository/LayerElementFileTree'
import TraitTable from 'src/components/repository/TraitElementTable'
import { CollectionNavigationEnum } from 'src/shared/enums'

const Page = () => {
  const router: NextRouter = useRouter()
<<<<<<< HEAD:apps/www/src/pages/[organisation]/[repository]/rarity/[layer].tsx
  const { bindings: inputBindingsrc/hooks/store/useRepositoryStore
  const layerName: string = router.qsrc/hooks/utils/useRepositoryRoute
=======
>>>>>>> staging:www/src/pages/[organisation]/[repository]/rarity/[layer].tsx
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisation } = useQueryOrganisationFindAll()
  const { mainRepositoryHref, isLoading: isRoutesLoading } = useRepositoryRoute()
<<<<<<< HEAD:apps/www/src/pages/[organisation]/[repository]/rarity/[layer].tsx
  const { setRepositoryId } = useRepositoryStore((state) => {
    return {
      setRepositoryId: state.setRepositoryId,
    }
  })
  const [currentView, setCurrentView] = useState<'rarity' | 'layers'>('rarity')
  const [isOpen, setIsOpen] = useState(false)
  const { setCurrentLayerPriority } = useCollectionNavigationStore((state) => {
    return {
      currentLayerPriority: state.currentLayerPriority,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
    }
  })

  const isLoading = isLoadingLayers && isLoadingRepository && isRoutesLoading && isLoadingOrganisation
  const filteredTraitElements = layer?.traitElements.filter((x) => x.name.toLowerCase().includes(input.toLowerCase()))

  useEffect(() => {
    layers && layerName && setCurrentLayerPriority(layers?.find((l) => l.name === layerName)?.id || '')
  }, [layerName, isLoading])
=======
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
>>>>>>> staging:www/src/pages/[organisation]/[repository]/rarity/[layer].tsx

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  return (
    <OrganisationAuthLayout>
      <Layout>
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
          ]}
        >
          <HeaderInternalPageRoutes
            links={[
              {
                name: CollectionNavigationEnum.enum.Preview,
                href: `/${mainRepositoryHref}`,
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rarity,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${layer?.name}`,
                enabled: true,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rules,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}`,
                enabled: false,
                loading: isLoadingLayers,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body border='none'>
<<<<<<< HEAD:apps/www/src/pages/[organisation]/[repository]/rarity/[layer].tsx
          <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
            <div className='col-span-2 py-8'>
              <div className='space-y-4'>
                <LayerFolderSelector />
              </div>
            </div>
            <div className='col-span-8'>
              <main className='space-y-3 py-8 pl-8'>
                <div className='grid gap-x-3 grid-cols-8'>
                  <div className='col-span-2'>
                    <span
                      className={clsx(
                        !hasLoaded() && 'bg-accents_7 bg-opacity-50 animate-pulse rounded-[5px]',
                        'text-lg flex items-end h-full font-semibold'
                      )}
                    >
                      {layer?.name}
                    </span>
                  </div>
                  <div className='col-span-5 flex justify-between'>
                    <div />
                    <div className='w-3/4'>
                      <Search {...inputBindings} isLoading={!hasLoaded()} />
                    </div>
                  </div>
                  <div
                    className={clsx(
                      !hasLoaded() && 'bg-accents_7 bg-opacity-50 animate-pulse rounded-[5px] w-full border-none',
                      'border bg-background border-border rounded-[5px]'
                    )}
                  >
                    <div className={clsx(!hasLoaded() && 'invisible', 'flex w-full h-full')}>
                      <button
                        onClick={() => setCurrentView('rarity')}
                        className={clsx(
                          currentView === 'rarity' ? 'bg-accents_8 text-foreground' : 'text-accents_5',
                          'flex w-full items-center justify-center space-x-2 p-2'
                        )}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className={clsx('w-3 h-3')}
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentView('layers')}
                        className={clsx(
                          currentView === 'layers' && 'bg-accents_8 text-foreground',
                          'flex w-full items-center justify-center space-x-2 p-2 text-accents_5'
                        )}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.25}
                          stroke='currentColor'
                          className={clsx('w-3 h-3', currentView === 'layers' ? 'text-foreground' : 'text-accents_5')}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* <button
                      className={clsx(
                        'flex w-full items-center justify-center space-x-2 p-2 text-xs border border-border rounded-[5px] bg-success text-accents_8'
                      )}
                    >
                      Add Trait
                    </button> */}
                </div>
                <div className={clsx(currentView !== 'layers' && 'hidden')}>
                  <LayerGridView traitElements={filteredTraitElements} />
                </div>
                <div className={clsx(currentView !== 'rarity' && 'hidden')}>
                  <LayerRarityTable traitElements={filteredTraitElements} />
                </div>
              </main>
            </div>
=======
          <div className='py-6 grid grid-cols-10 gap-x-6'>
            <LayerElementFileTree className='col-span-2' layerElements={layers} repository={repository} />
            <TraitTable className='col-span-8' layerElement={layer} repositoryId={repositoryId} />
>>>>>>> staging:www/src/pages/[organisation]/[repository]/rarity/[layer].tsx
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
