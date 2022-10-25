import { OrganisationAuthLayout } from '@components/Layout/core/AuthLayout'
import { Layout } from '@components/Layout/core/Layout'
import { RuleSelector } from '@components/Repository/RepositoryRuleCreateView'
import { RuleDisplayAll } from '@components/Repository/RepositoryRuleDisplayView'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { CollectionNavigationEnum } from 'src/types/enums'
import { useRepositoryRoute } from '../../../hooks/utils/useRepositoryRoute'

const Page = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { all: layers, current: layer, isLoading: isLoadingLayers } = useQueryRepositoryLayer()
  const { all: collections, isLoading: isLoadingCollection, mutate } = useQueryRepositoryCollection()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepository()
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisation } = useQueryOrganisation()
  const { mainRepositoryHref, isLoading: isRoutesLoading } = useRepositoryRoute()
  const { setRepositoryId } = useRepositoryStore((state) => {
    return {
      setRepositoryId: state.setRepositoryId,
    }
  })
  const isLoading = isLoadingLayers && isLoadingCollection && isLoadingRepository && isRoutesLoading && isLoadingOrganisation

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
          internalNavigation={[
            {
              name: CollectionNavigationEnum.enum.Preview,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}`,
              enabled: false,
            },
            {
              name: CollectionNavigationEnum.enum.Rarity,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rarity}/${layer?.name}`,
              enabled: false,
            },
            {
              name: CollectionNavigationEnum.enum.Rules,
              loading: mainRepositoryHref === null || isLoading,
              href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Rules}`,
              enabled: true,
            },
          ]}
        />
        <Layout.Body border='lower'>
          <div className='w-full py-16'>
            <div className='flex justify-center'>
              <div className='space-y-1 w-full'>
                <span className='text-xs font-semibold uppercase'>Create a condition</span>
                {layers && <RuleSelector layers={layers} />}
              </div>
            </div>
          </div>
          {layers &&
          layers.flatMap((x) => x.traitElements).filter((x) => x.rulesPrimary.length || x.rulesSecondary.length).length ? (
            <div className='w-full py-16'>
              <div className='space-y-3 w-full flex flex-col justify-center'>
                <span className='text-xs font-semibold uppercase'>All rules created</span>
                {layers && <RuleDisplayAll traitElements={layers.flatMap((x) => x.traitElements)} />}
              </div>
            </div>
          ) : null}
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
