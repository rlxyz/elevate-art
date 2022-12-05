import AvatarComponent from '@components/layout/avatar/Avatar'
import NextLinkComponent from '@components/layout/link/NextLink'
import RepositoryDeploymentCreateModal from '@components/repository/Deployment/RepositoryDeploymentCreateModal'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repository/useQueryRepositoryDeployments'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { timeAgo } from 'src/client/utils/time'
import { env } from 'src/env/client.mjs'
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
  const { all: deployments, isLoading: isLoadingOrganisations } = useQueryRepositoryDeployments()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { mainRepositoryHref } = useRepositoryRoute()
  const { collectionName } = useRepositoryRoute()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

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
        <Layout.Body border='lower'>
          <div className='w-full h-full'>
            <div className='h-32 flex items-center justify-between'>
              <h1 className='text-2xl font-semibold'>Deployments</h1>
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs'
              >
                Create Deployment
              </button>
            </div>
          </div>
          <div className='py-8'>
            <div className='border-t border-b border-mediumGrey'>
              {deployments?.map((deployment) => (
                <div key={deployment.id} className='p-4 border-l border-r border-mediumGrey border-b grid grid-cols-4'>
                  <div className='flex flex-col justify-center'>
                    <NextLinkComponent
                      underline
                      href={`${env.NEXT_PUBLIC_API_URL}/asset/${organisationName}/${repositoryName}/${deployment.name}/0`}
                      className='text-xs font-semibold w-fit'
                    >
                      {deployment.name}
                    </NextLinkComponent>
                    <span className='text-xs'>Preview</span>
                  </div>
                  <div>
                    <span className='text-xs'>
                      Deployed from <strong>{deployment.collectionName}</strong>
                    </span>
                  </div>
                  <div className='text-xs flex flex-col'>
                    <span>
                      Total Supply <strong>{deployment.collectionTotalSupply}</strong>
                    </span>
                    <span>
                      Generation <strong>{deployment.collectionGenerations}</strong>
                    </span>
                  </div>
                  <div className='text-xs flex justify-end items-center space-x-2'>
                    <span>{timeAgo(deployment.createdAt)} by Jeevan Pillay</span>
                    <AvatarComponent src='/images/avatar-blank.png' />
                  </div>
                </div>
              ))}
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
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
