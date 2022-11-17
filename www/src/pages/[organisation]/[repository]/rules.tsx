import { Layout } from '@components/Layout/core/Layout'
import { OrganisationAuthLayout } from '@components/Organisation/OrganisationAuthLayout'
import { RuleSelector } from '@components/Repository/rules/RepositoryRuleCreateView'
import { RuleDisplayAll } from '@components/Repository/rules/RepositoryRuleDisplayView'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
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
        <>
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
          <Layout.Body border='lower'>
            <div className='w-full py-16'>
              <div className='flex justify-center'>
                <div className='space-y-1 w-full'>
                  <span className='text-xs font-semibold uppercase'>Create a condition</span>
                  <RuleSelector layers={layers} />
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
        </>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
