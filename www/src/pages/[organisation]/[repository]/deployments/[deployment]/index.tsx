import { AppRoutesNavbar } from '@components/layout/core/AppRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { CollectionNavigationEnum, DeploymentNavigationEnum } from 'src/shared/enums'

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
  const deploymentName: string = router.query.deployment as string
  const { current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { all: collections, isLoading: isLoadingCollection, mutate } = useQueryCollectionFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { all: deployments, isLoading: isLoadingOrganisations } = useQueryRepositoryDeployments()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { collectionName, mainRepositoryHref } = useRepositoryRoute()

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
            { current: deploymentName, href: `/${organisationName}/${repositoryName}/deployments/${deploymentName}` },
          ]}
        >
          <AppRoutesNavbar
            links={[
              {
                name: DeploymentNavigationEnum.enum.Overview,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}`,
                enabled: true,
                loading: isLoadingLayers,
              },
              {
                name: DeploymentNavigationEnum.enum.Contract,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}/contract`,
                enabled: false,
                loading: isLoadingLayers,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body border={'lower'}>
          <div className='h-52'>
            <div>Information about art work goes here....</div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
