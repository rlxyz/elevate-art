import AvatarComponent from '@components/layout/avatar/Avatar'
import { ArrowTopRightIcon } from '@components/layout/icons/ArrowTopRightIcon'
import NextLinkComponent from '@components/layout/link/NextLink'
import Menu from '@components/layout/menu'
import RepositoryDeploymentCreateModal from '@components/repository/Deployment/RepositoryDeploymentCreateModal'
import RepositoryDeploymentDeleteModal from '@components/repository/Deployment/RepositoryDeploymentDeleteModal'
import withOrganisationStore from '@components/withOrganisationStore'
import { LinkIcon, TrashIcon } from '@heroicons/react/outline'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repository/useQueryRepositoryDeployments'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useNotification } from '@hooks/utils/useNotification'
import type { AssetDeployment } from '@prisma/client'
import { AssetDeploymentStatus } from '@prisma/client'
import clsx from 'clsx'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { formatEthereumHash, toPascalCaseWithSpace } from 'src/client/utils/format'
import { timeAgo } from 'src/client/utils/time'
import { env } from 'src/env/client.mjs'
import { CollectionNavigationEnum } from 'src/shared/enums'
import { useRepositoryRoute } from '../../../client/hooks/utils/useRepositoryRoute'

const DeploymentPreviewCard = ({
  deployment,
  organisationName,
  repositoryName,
}: {
  deployment: AssetDeployment & {
    creator: {
      address: string
    } | null
  }
  organisationName: string
  repositoryName: string
}) => {
  const { notifyInfo } = useNotification()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const onClipboardCopy = () => {
    navigator.clipboard.writeText(`${env.NEXT_PUBLIC_API_URL}/assets/${organisationName}/${repositoryName}/${deployment.name}/0`)
    notifyInfo('Copied to clipboard')
  }

  return (
    <div key={deployment.id} className='p-4 grid grid-cols-4'>
      <div className='flex flex-col justify-center  text-xs'>
        {deployment.status === AssetDeploymentStatus.DEPLOYED ? (
          <NextLinkComponent
            rel='noreferrer nofollow'
            target='_blank'
            underline
            href={`${env.NEXT_PUBLIC_API_URL}/assets/${organisationName}/${repositoryName}/${deployment.name}/0`}
            className='font-semibold w-fit'
          >
            {deployment.name}
          </NextLinkComponent>
        ) : (
          <span>{deployment.name}</span>
        )}
        <span>{toPascalCaseWithSpace(deployment.branch)}</span>
      </div>
      <div>
        <span className='text-xs flex flex-col h-full space-x-2'>
          <div className='flex space-x-3'>
            <div
              className={clsx(
                'rounded-full w-4 h-4 border border-mediumGrey',
                deployment.status === AssetDeploymentStatus.FAILED && 'bg-redError',
                deployment.status === AssetDeploymentStatus.DEPLOYED && 'bg-blueHighlight',
                deployment.status === AssetDeploymentStatus.PENDING && 'bg-lightGray'
              )}
            />
            <div className='flex flex-col'>
              <span>
                {deployment.status === AssetDeploymentStatus.FAILED && 'Error'}
                {deployment.status === AssetDeploymentStatus.DEPLOYED && 'Ready'}
                {deployment.status === AssetDeploymentStatus.PENDING && 'Deploying'}
              </span>
              <span>{timeAgo(deployment.updatedAt)}</span>
            </div>
          </div>
        </span>
      </div>
      <div className='text-xs flex flex-col'>
        <span>
          Total Supply <strong>{deployment.totalSupply}</strong>
        </span>
        <span>
          Generation <strong>{deployment.generations}</strong>
        </span>
      </div>
      <div className='text-xs flex justify-end items-center space-x-2'>
        {deployment.creator?.address && (
          <>
            <span>
              {timeAgo(deployment.createdAt)} by <strong>{formatEthereumHash(deployment.creator?.address)}</strong>
            </span>
            <AvatarComponent src='/images/avatar-blank.png' />
          </>
        )}
        <div className='relative w-6'>
          <Menu vertical position='bottom-left'>
            <Menu.Items>
              <Menu.Item as='button' type='button' onClick={() => setIsDeleteDialogOpen(true)}>
                <TrashIcon className='w-3 h-3' />
                <span>Delete</span>
              </Menu.Item>
            </Menu.Items>
            <Menu.Items>
              <Menu.Item as='button' type='button' onClick={() => onClipboardCopy()}>
                <LinkIcon className='w-3 h-3' />
                <span>Copy URL</span>
              </Menu.Item>
              <Menu.Item
                as={NextLinkComponent}
                href={`${env.NEXT_PUBLIC_API_URL}/assets/${organisationName}/${repositoryName}/${deployment.name}/0`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <ArrowTopRightIcon className='w-3 h-3' />
                <span>Vist</span>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <RepositoryDeploymentDeleteModal visible={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} deployment={deployment} />
    </div>
  )
}

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
        <Layout.Body border={'lower'}>
          <div className='w-full h-full'>
            <div className='h-32 flex items-center justify-between'>
              <h1 className='text-2xl font-semibold'>Deployments</h1>
              <div className='space-x-2'>
                <button
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
                  <DeploymentPreviewCard deployment={deployment} organisationName={organisationName} repositoryName={repositoryName} />
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
