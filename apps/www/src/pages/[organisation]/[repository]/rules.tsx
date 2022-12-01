import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { NextRouter, useRouter } from "next/rosrc/hooks/trpc/repository/useQueryRepositoryFindByName"
import { useEffect } from 'react'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { HeaderInternalPageRoutes } from 'src/components/layout/core/Header'
import { Layout } from 'src/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/components/organisation/OrganisationAuthLayout'
import withOrganisationStore from 'src/components/withOrganisationStore'
import { useQueryOrganisationFindAll } from 'src/hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { CollectionNavigationEnum } from 'src/shared/enums'
import { useQueryRepositoryFindByName } from src / hooks / trpc / organisation / useQueryOrganisationFindAll
import { useRepositoryRoute } from frsrc / hooks / store / useRepositoryStoretoryRoute
'
'

const Page = () => {../../../hooks/utils/useRepositoryRoute
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
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
          ]}
<<<<<<< HEAD:apps/www/src/pages/[organisation]/[repository]/rules.tsx
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
=======
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
>>>>>>> staging:www/src/pages/[organisation]/[repository]/rules.tsx
        <Layout.Body border='lower'>
          <div className='w-full py-16'>
            <div className='flex justify-center'>
              <div className='space-y-1 w-full'>
                <span className='text-xs font-semibold uppercase'>Create a condition</span>
<<<<<<< HEAD:apps/www/src/pages/[organisation]/[repository]/rules.tsx
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
=======
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
>>>>>>> staging:www/src/pages/[organisation]/[repository]/rules.tsx
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
