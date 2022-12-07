import RepositoryDeploymentBucketCreateModal from '@components/repository/Deployment/RepositoryDeploymentBucketCreateModal'
import RepositoryDeploymentCreateModal from '@components/repository/Deployment/RepositoryDeploymentCreateModal'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repository/useQueryRepositoryDeployments'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import clsx from 'clsx'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { CollectionNavigationEnum } from 'src/shared/enums'
import { RepositoryDeploymentPreviewCard } from '../../../client/components/repository/Deployment/RepositoryDeploymentPreviewCard'
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
  const { all: deployments, isLoading: isLoadingOrganisations } = useQueryRepositoryDeployments()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { mainRepositoryHref } = useRepositoryRoute()
  const { collectionName } = useRepositoryRoute()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreateBucketDialogOpen, setIsCreateBucketDialogOpen] = useState(false)

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
                enabled: true,
                loading: isLoadingLayers,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body border={'lower'}>
          <div className='w-full h-full'>
            <div className='h-32 flex items-center justify-between'>
              <h1 className='text-2xl font-semibold'>Deployments</h1>
              <div className='space-x-2'>
                {!repository?.bucket && (
                  <button
                    onClick={() => setIsCreateBucketDialogOpen(true)}
                    className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs'
                  >
                    Setup
                  </button>
                )}
                <button
                  disabled={!repository?.bucket}
                  onClick={() => setIsCreateDialogOpen(true)}
                  className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
                >
                  Create Deployment
                </button>
              </div>
            </div>
            {collections && repository && (
              <RepositoryDeploymentCreateModal
                visible={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                repository={repository}
                collections={collections}
              />
            )}
            {collections && repository && (
              <RepositoryDeploymentBucketCreateModal
                visible={isCreateBucketDialogOpen}
                onClose={() => setIsCreateBucketDialogOpen(false)}
                repository={repository}
              />
            )}
          </div>

          {deployments && deployments.length > 0 ? (
            <div className='py-8'>
              {deployments.map((deployment, index) => (
                <div
                  key={deployment.id}
                  className={clsx(
                    'border-l border-r border-mediumGrey border-b',
                    index === 0 && 'rounded-tl-[5px] rounded-tr-[5px] border-t',
                    index === deployments.length - 1 && 'rounded-bl-[5px] rounded-br-[5px]'
                  )}
                >
                  <RepositoryDeploymentPreviewCard
                    deployment={deployment}
                    organisationName={organisationName}
                    repositoryName={repositoryName}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
