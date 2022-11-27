import { useQueryRepositoryLayer } from '@hooks/router/layerElement/useQueryRepositoryLayer'
import { useQueryOrganisation } from '@hooks/router/organisation/useQueryOrganisation'
import { useQueryRepository } from '@hooks/router/repository/useQueryRepository'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { RulesDisplay } from 'src/client/components/repository/RulesDisplay'
import { RulesSelector } from 'src/client/components/repository/RulesSelector'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { CollectionNavigationEnum } from 'src/shared/enums'
import { useRepositoryRoute } from '../../../client/hooks/utils/useRepositoryRoute'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryRepositoryLayer()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepository()
  const { all: organisations } = useQueryOrganisation()
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
                enabled: true,
                loading: isLoadingLayers,
              },
            ]}
          />
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

export default Page
