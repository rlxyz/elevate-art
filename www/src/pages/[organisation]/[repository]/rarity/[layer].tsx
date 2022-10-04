import { OrganisationAuthLayout } from '@components/Layout/AuthLayout'
import { Layout } from '@components/Layout/Layout'
import LayerFolderSelector from '@components/Repository/RepositoryFolderSelector'
import RepositoryRarityView from '@components/Repository/RepositoryRarityView'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { CollectionNavigationEnum, CollectionTitleContent } from 'src/types/enums'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryRepositoryLayer()
  const { all: collections, isLoading: isLoadingCollection, mutate } = useQueryRepositoryCollection()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepository()
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisation } = useQueryOrganisation()
  const { mainRepositoryHref, isLoading: isRoutesLoading } = useRepositoryRoute()
  const { setRepositoryId } = useRepositoryStore((state) => {
    return {
      setRepositoryId: state.setRepositoryId,
    }
  })
  const { setCurrentLayerPriority } = useCollectionNavigationStore((state) => {
    return {
      currentLayerPriority: state.currentLayerPriority,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
    }
  })
  const isLoading = isLoadingLayers && isLoadingCollection && isLoadingRepository && isRoutesLoading && isLoadingOrganisation

  useEffect(() => {
    if (layers && layers[0]) setCurrentLayerPriority(layers[0].id)
  }, [isLoadingLayers])

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
        <Layout.Title>
          <main className='pointer-events-auto -ml-2'>
            <div className='flex justify-between items-center h-[10rem] space-y-2'>
              <div className='flex flex-col space-y-1'>
                <span className='text-3xl font-semibold'>{CollectionTitleContent['rarity'].title}</span>
                <span className='text-sm text-darkGrey'>{CollectionTitleContent['rarity'].description}</span>
              </div>
            </div>
          </main>
        </Layout.Title>

        <Layout.Body border='none'>
          <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
            <div className='col-span-2 py-8 -ml-4'>
              <div className='flex flex-col space-y-3 justify-between'>
                <LayerFolderSelector />
              </div>
            </div>
            <div className='col-span-8'>
              <main className='space-y-6 py-8 pl-8'>
                <RepositoryRarityView />
              </main>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
