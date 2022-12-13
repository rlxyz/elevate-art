import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { RulesDisplay } from 'src/client/components/repository/RulesDisplay'
import { RulesSelector } from 'src/client/components/repository/RulesSelector'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { env } from 'src/env/client.mjs'
import { CollectionNavigationEnum } from 'src/shared/enums'
import { useRepositoryRoute } from '../../../../client/hooks/utils/useRepositoryRoute'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { mainRepositoryHref } = useRepositoryRoute()
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
            { current: organisationName, href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisationName}`, organisations },
            { current: repositoryName, href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisationName}/${repositoryName}` },
          ]}
        >
          <PageRoutesNavbar>
            {[
              {
                name: CollectionNavigationEnum.enum.Preview,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${mainRepositoryHref}`,
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rarity,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${layer?.name}`,
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rules,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}`,
                enabled: true,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Deployments,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}`,
                enabled: false,
                loading: isLoadingLayers,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.Header>
        <Layout.Body border='lower'>
          <div className='w-full py-16'>
            <div className='flex justify-center'>
              <div className='space-y-1 w-full'>
                <span className='text-xs font-semibold uppercase'>Create a condition</span>
                <RulesSelector layers={layers} />
              </div>
            </div>
          </div>
          <div className='w-full py-16'>
            <div className='space-y-3 w-full flex flex-col justify-center'>
              <span className='text-xs font-semibold uppercase'>All rules created</span>
              <RulesDisplay traitElements={layers.flatMap((x) => x.traitElements)} />
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
