import AvatarComponent from '@components/layout/avatar/Avatar'
import NextLinkComponent from '@components/layout/link/NextLink'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { RepositoryDeployment } from '@prisma/client'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
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
            <div className='h-32 flex items-center'>
              <h1 className='text-2xl font-semibold'>Deployments</h1>
            </div>
          </div>
          <div className='py-8'>
            <div className='border-t border-b border-mediumGrey'>
              {(
                [
                  {
                    id: '1',
                    name: 'g83v05uf',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    collectionName: 'main',
                    collectionTotalSupply: 100,
                    collectionGenerations: 64,
                    repositoryId: '64',
                    userId: '1',
                  },
                  {
                    id: '1',
                    name: '40g10bps',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    collectionName: 'testing-1',
                    collectionTotalSupply: 100,
                    collectionGenerations: 23,
                    repositoryId: '23',
                    userId: '1',
                  },
                  {
                    id: '1',
                    name: 'rjg949ffs',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    collectionName: 'development',
                    collectionTotalSupply: 100,
                    collectionGenerations: 9,
                    repositoryId: '9',
                    userId: '1',
                  },
                  {
                    id: '1',
                    name: 'v040gk10',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    collectionName: 'development',
                    collectionTotalSupply: 100,
                    collectionGenerations: 1,
                    repositoryId: '1',
                    userId: '1',
                  },
                ] as RepositoryDeployment[]
              ).map((deployment) => (
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
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
