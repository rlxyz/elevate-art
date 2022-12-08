import { AppRoutesNavbar } from '@components/layout/header/AppRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import CollectionBranchSelectorCard from 'src/client/components/collection/CollectionBranchSelectorCard'
import { GenerateButton } from 'src/client/components/collection/CollectionGenerateCard'
import CollectionPreviewFilters from 'src/client/components/collection/CollectionPreviewFilters'
import CollectionPreviewGrid from 'src/client/components/collection/CollectionPreviewGrid'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { CollectionNavigationEnum } from 'src/shared/enums'
import { useRepositoryRoute } from '../../../client/hooks/utils/useRepositoryRoute'

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

  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { all: collections, isLoading: isLoadingCollection, mutate } = useQueryCollectionFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { mainRepositoryHref } = useRepositoryRoute()
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
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
          ]}
        >
          <AppRoutesNavbar>
            {[
              {
                name: CollectionNavigationEnum.enum.Preview,
                href: `/${mainRepositoryHref}`,
                enabled: true,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rarity,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${layer?.name}`,
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rules,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}`,
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Deployments,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}`,
                enabled: false,
                loading: isLoadingLayers,
              },
            ].map((item) => (
              <AppRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </AppRoutesNavbar>
        </Layout.Header>
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
