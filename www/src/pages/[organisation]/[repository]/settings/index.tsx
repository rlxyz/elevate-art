import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import type { NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { OrganisationGeneralSettings, SettingsNavigations } from 'src/client/components/organisation/OrganisationSettings'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { CollectionNavigationEnum, OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/shared/enums'

const Page: NextPage = () => {
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisationFindAll()
  const { setCurrentSettingsRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      setCurrentSettingsRoute: state.setCurrentSettingsRoute,
      currentRoute: state.currentRoute,
    }
  })
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const { mainRepositoryHref } = useRepositoryRoute()
  const { current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()

  useEffect(() => {
    setCurrentSettingsRoute(OrganisationSettingsNavigationEnum.enum.General)
  }, [])

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Settings}>
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
                name: CollectionNavigationEnum.enum.Settings,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Settings}`,
                enabled: true,
                loading: isLoadingLayers,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body>
          <div className='-ml-4 py-8 space-y-8'>
            {
              <div className='grid grid-cols-10 gap-x-6'>
                <div className='col-span-2'>
                  <SettingsNavigations />
                </div>
                <div className='col-span-8'>
                  <div className='space-y-6'>
                    <OrganisationGeneralSettings />
                    {/* <OrganisationMemberDelete organisation={organisation} /> */}
                  </div>
                </div>
              </div>
            }
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
