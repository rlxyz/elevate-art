import { Layout } from '@components/Layout/core/Layout'
import SearchInput from '@components/Layout/SearchInput'
import { OrganisationAuthLayout } from '@components/Organisation/OrganisationAuthLayout'
import LayerElementFileTree from '@components/Repository/layer-file-tree'
import TraitTable, { TraitElementView, TraitElementViewType } from '@components/Repository/trait-table'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
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
  const [currentView, setCurrentView] = useState<TraitElementViewType>(TraitElementView.enum.Table)

  const filteredTraitElements = layer?.traitElements.filter((x) => x.name.toLowerCase().includes(query.toLowerCase()))
  const isLoading = !filteredTraitElements

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  const currentLayerId = layers?.find((l) => l.name === layerName)?.id || ''

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
          <div className='space-y-3 py-6'>
            <div className='grid grid-flow-row-dense grid-cols-10 grid-rows-1 gap-x-6'>
              <div className='col-span-2 text-lg font-semibold uppercase flex items-end h-full'>Layers</div>

              <div className='col-span-8 grid gap-x-3 grid-cols-8'>
                <div className='col-span-2 '>
                  <span
                    className={clsx(
                      isLoading && 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px]',
                      'text-lg font-semibold uppercase flex items-end h-full'
                    )}
                  >
                    {layer?.name}
                  </span>
                </div>

                <div className='col-span-5 flex justify-end'>
                  <div className='w-3/4'>
                    <SearchInput
                      onChange={(e) => {
                        e.preventDefault()
                        setQuery(e.target.value)
                      }}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
                <div
                  className={clsx(
                    isLoading && 'bg-mediumGrey bg-opacity-50 animate-pulse rounded-[5px] w-full border-none',
                    'border bg-white border-mediumGrey rounded-[5px]'
                  )}
                >
                  <div className={clsx(isLoading && 'invisible', 'flex w-full h-full divide-x divide-mediumGrey')}>
                    <button
                      onClick={() => setCurrentView(TraitElementView.enum.Table)}
                      className={clsx(
                        currentView === TraitElementView.enum.Table ? 'bg-lightGray text-black' : 'text-darkGrey',
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
                      onClick={() => setCurrentView(TraitElementView.enum.Grid)}
                      className={clsx(
                        currentView === TraitElementView.enum.Grid && 'bg-lightGray text-black',
                        'flex w-full items-center justify-center space-x-2 p-2 text-darkGrey'
                      )}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.25}
                        stroke='currentColor'
                        className={clsx('w-3 h-3', currentView === TraitElementView.enum.Grid ? 'text-black' : 'text-darkGrey')}
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
              </div>
            </div>

            <div className='grid grid-flow-row-dense grid-cols-10 grid-rows-1 gap-x-6'>
              <div className='col-span-2'>
                <LayerElementFileTree layers={layers} currentLayerId={currentLayerId} />
              </div>
              <div className='col-span-8'>
                <TraitTable layerElement={layer} view={currentView} repositoryId={repositoryId} searchFilter={query} />
              </div>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
