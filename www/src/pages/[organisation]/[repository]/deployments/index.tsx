import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import RepositoryDeploymentBucketCreateModal from '@components/repository/RepositoryDeployment/RepositoryDeploymentBucketCreateModal'
import RepositoryDeploymentCreateModal from '@components/repository/RepositoryDeployment/RepositoryDeploymentCreateModal'
import { RepositoryDeploymentPreviewCard } from '@components/repository/RepositoryDeployment/RepositoryDeploymentPreviewCard'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { CollectionNavigationEnum } from '@utils/enums'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'

const Page = () => {
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
  const { current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { all: collections } = useQueryCollectionFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { all: deployments } = useQueryRepositoryDeployments()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { organisationName, repositoryName, mainRepositoryHref } = useRepositoryRoute()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreateBucketDialogOpen, setIsCreateBucketDialogOpen] = useState(false)

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
          <PageRoutesNavbar>
            {[
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
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
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
                    'border-l border-r border-mediumGrey border-b p-4',
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
