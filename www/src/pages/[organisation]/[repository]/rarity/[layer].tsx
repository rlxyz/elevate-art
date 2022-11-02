import { OrganisationAuthLayout } from '@components/Layout/core/AuthLayout'
import { Layout } from '@components/Layout/core/Layout'
import { SearchInput } from '@components/Layout/SearchInput'
import LayerFolderSelector from '@components/Repository/RepositoryFolderSelector'
import LayerGridView from '@components/Repository/trait-table/trait-grid'
import RepositoryRuleDisplayView from '@components/Repository/trait-table/trait-table'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import clsx from 'clsx'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CollectionNavigationEnum } from 'src/types/enums'

const Page = () => {
  const router: NextRouter = useRouter()
  const layerName: string = router.query.layer as string
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryRepositoryLayer()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepository()
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisation } = useQueryOrganisation()
  const { mainRepositoryHref, isLoading: isRoutesLoading } = useRepositoryRoute()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { setRepositoryId } = useRepositoryStore((state) => {
    return {
      setRepositoryId: state.setRepositoryId,
    }
  })
  const [query, setQuery] = useState('')
  const [currentView, setCurrentView] = useState<'rarity' | 'layers'>('rarity')
  const [isOpen, setIsOpen] = useState(false)
  const { setCurrentLayerPriority } = useCollectionNavigationStore((state) => {
    return {
      currentLayerPriority: state.currentLayerPriority,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
    }
  })

  const isLoading = isLoadingLayers && isLoadingRepository && isRoutesLoading && isLoadingOrganisation
  const filteredTraitElements = layer?.traitElements.filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    layers && layerName && setCurrentLayerPriority(layers?.find((l) => l.name === layerName)?.id || '')
  }, [layerName, isLoading])

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  const hasLoaded = () => {
    return !isLoading && filteredTraitElements
  }

  return (
    <OrganisationAuthLayout>
      <Layout>
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
          ]}
          internalNavigation={[
            {
              name: CollectionNavigationEnum.enum.Preview,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}`,
              enabled: false,
            },
            {
              name: CollectionNavigationEnum.enum.Rarity,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${layer?.name}`,
              enabled: true,
            },
            {
              name: CollectionNavigationEnum.enum.Rules,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}`,
              enabled: false,
            },
          ]}
        />
        <Layout.Body border='none'>
          <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
            <div className='col-span-2 py-8 -ml-4'>
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
                        !hasLoaded() && 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px]',
                        'text-lg flex items-end h-full font-semibold'
                      )}
                    >
                      {layer?.name}
                    </span>
                  </div>
                  <div className='col-span-5 flex justify-between'>
                    <div />
                    <div className='w-3/4'>
                      <SearchInput setQuery={setQuery} isLoading={!hasLoaded()} />
                    </div>
                  </div>
                  <div
                    className={clsx(
                      !hasLoaded() && 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px] w-full border-none',
                      'border bg-white border-mediumGrey rounded-[5px]'
                    )}
                  >
                    <div className={clsx(!hasLoaded() && 'invisible', 'flex w-full h-full')}>
                      <button
                        onClick={() => setCurrentView('rarity')}
                        className={clsx(
                          currentView === 'rarity' ? 'bg-lightGray text-black' : 'text-darkGrey',
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
                          currentView === 'layers' && 'bg-lightGray text-black',
                          'flex w-full items-center justify-center space-x-2 p-2 text-darkGrey'
                        )}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.25}
                          stroke='currentColor'
                          className={clsx('w-3 h-3', currentView === 'layers' ? 'text-black' : 'text-darkGrey')}
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
                        'flex w-full items-center justify-center space-x-2 p-2 text-xs border border-mediumGrey rounded-[5px] bg-blueHighlight text-white'
                      )}
                    >
                      Add Trait
                    </button> */}
                </div>
                <div className={clsx(currentView !== 'layers' && 'hidden')}>
                  <LayerGridView traitElements={filteredTraitElements} repositoryId={repositoryId} />
                </div>
                <div className={clsx(currentView !== 'rarity' && 'hidden')}>
                  {filteredTraitElements && layer && (
                    <RepositoryRuleDisplayView
                      traitElements={filteredTraitElements}
                      initialSum={layer.traitElements.reduce((a, b) => a + b.weight, 0)}
                      repositoryId={repositoryId}
                    />
                  )}
                </div>
              </main>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
function setCurrentView(arg0: string): void {
  throw new Error('Function not implemented.')
}
