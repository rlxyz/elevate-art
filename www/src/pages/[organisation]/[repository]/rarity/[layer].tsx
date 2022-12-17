import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import LayerElementFileTree from 'src/client/components/repository/LayerElementFileTree'
import TraitTable from 'src/client/components/repository/TraitElementTable'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useRepositoryRoute } from 'src/client/hooks/utils/useRepositoryRoute'
import { CollectionNavigationEnum } from 'src/shared/enums'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisation } = useQueryOrganisationFindAll()
  const { mainRepositoryHref, isLoading: isRoutesLoading } = useRepositoryRoute()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)

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
            { current: repositoryName, href: `/${organisationName}/${encodeURIComponent(repositoryName)}` },
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
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${encodeURIComponent(layer?.name || '')}`,
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
        </Layout.Header>
        <Layout.Body border='none'>
          <div className='py-6 grid grid-cols-10 gap-x-6'>
            <LayerElementFileTree className='col-span-2' layerElements={layers} repository={repository} />
            <TraitTable className='col-span-8' layerElement={layer} repositoryId={repositoryId} />
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
