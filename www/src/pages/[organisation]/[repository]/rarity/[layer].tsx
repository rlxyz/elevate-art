import { Layout } from '@components/Layout/core/Layout'
import { OrganisationAuthLayout } from '@components/Organisation/OrganisationAuthLayout'
import LayerElementFileTree from '@components/Repository/layer-file-tree'
import TraitTable from '@components/Repository/trait-table'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
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
              href: `/${mainRepositoryHref}`,
              enabled: false,
              loading: isLoadingLayers,
            },
            {
              name: CollectionNavigationEnum.enum.Rarity,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${layer?.name}`,
              enabled: true,
              loading: isLoadingLayers,
            },
            {
              name: CollectionNavigationEnum.enum.Rules,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}`,
              enabled: false,
              loading: isLoadingLayers,
            },
          ]}
        />
        <Layout.Body border='none'>
          <div className='py-6 grid grid-flow-row-dense grid-cols-10 grid-rows-1 gap-x-6'>
            <div className='col-span-2 space-y-3'>
              <div className='text-lg font-semibold uppercase'>Layers</div>
              <LayerElementFileTree layers={layers} currentLayerId={currentLayerId} />
            </div>
            <div className='col-span-8'>
              <TraitTable layerElement={layer} repositoryId={repositoryId} />
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
