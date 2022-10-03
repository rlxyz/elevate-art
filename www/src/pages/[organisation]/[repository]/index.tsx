import CollectionBranchSelectorCard from '@components/Collection/CollectionBranchSelectorCard'
import { GenerateButton } from '@components/Collection/CollectionGenerateCard'
import CollectionPreviewFilters from '@components/Collection/CollectionPreviewFilters'
import CollectionPreviewGrid from '@components/Collection/CollectionPreviewGrid'
import { Layout } from '@components/Layout/Layout'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useCollectionNavigationStore from '@hooks/store/useCollectionNavigationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CollectionNavigationEnum } from 'src/types/enums'
import { useRepositoryRoute } from '../../../hooks/utils/useRepositoryRoute'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [hasMounted, setHasMounted] = useState(false)
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryRepositoryLayer()
  const { all: collections, isLoading: isLoadingCollection, mutate } = useQueryRepositoryCollection()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepository()
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisation } = useQueryOrganisation()
  const { mainRepositoryHref, isLoading: isRoutesLoading } = useRepositoryRoute()
  const { setCollectionId, setRepositoryId, setOrganisationId } = useRepositoryStore((state) => {
    return {
      setOrganisationId: state.setOrganisationId,
      setRepositoryId: state.setRepositoryId,
      setCollectionId: state.setCollectionId,
    }
  })
  const { setCurrentLayerPriority, currentLayerPriority, setCurrentViewSection, currentViewSection } =
    useCollectionNavigationStore((state) => {
      return {
        currentLayerPriority: state.currentLayerPriority,
        currentViewSection: state.currentViewSection,
        setCurrentLayerPriority: state.setCurrentLayerPriority,
        setCurrentViewSection: state.setCurrentViewSection,
      }
    })
  const { collectionName } = useRepositoryRoute()
  const isLoading = isLoadingLayers && isLoadingCollection && isLoadingRepository && isRoutesLoading && isLoadingOrganisation

  useEffect(() => {
    setCurrentViewSection(CollectionNavigationEnum.enum.Preview)
  }, [])

  useEffect(() => {
    if (!organisation) return
    setOrganisationId(organisation.id)
  }, [isLoadingOrganisation])

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
    mutate({ collection })
  }, [isLoadingCollection])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <Layout>
      <>
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
              enabled: CollectionNavigationEnum.enum.Preview === currentViewSection,
            },
            {
              name: CollectionNavigationEnum.enum.Rarity,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${layer?.name}`,
              enabled: CollectionNavigationEnum.enum.Rarity === currentViewSection,
            },
            {
              name: CollectionNavigationEnum.enum.Rules,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}`,
              enabled: CollectionNavigationEnum.enum.Rules === currentViewSection,
            },
          ]}
        />
        <Layout.Body border='none'>
          <div className='w-full h-full grid grid-flow-row-dense grid-cols-10 grid-rows-1'>
            <div className='col-span-2 py-8 -ml-4'>
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
      </>
    </Layout>
  )
}

export default Page
