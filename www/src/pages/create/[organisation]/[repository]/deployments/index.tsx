import RepositoryDeploymentCreateModal from '@components/assetDeployment/RepositoryDeploymentCreateModal'
import { RepositoryDeploymentPreviewCard } from '@components/assetDeployment/RepositoryDeploymentPreviewCard'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { CollectionNavigationEnum, ZoneNavigationEnum } from '@utils/enums'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'

const Page = () => {
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
  const { current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { all: collections } = useQueryCollectionFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { all: deployments } = useQueryRepositoryDeployments()
  const { current: organisation } = useQueryOrganisationFindAll()
  const { organisationName, repositoryName } = useRepositoryRoute()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  return (
    <OrganisationAuthLayout>
      <Layout>
        <Layout.AppHeader>
          <AppRoutesNavbar>
            <AppRoutesNavbar.Item label={capitalize(ZoneNavigationEnum.enum.Create)} href={`/${ZoneNavigationEnum.enum.Create}`}>
              <ZoneRoutesNavbarPopover
                title='Apps'
                routes={[
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Dashboard),
                    href: `/${ZoneNavigationEnum.enum.Dashboard}`,
                    selected: false,
                    icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Create),
                    href: `/${ZoneNavigationEnum.enum.Create}`,
                    selected: true,
                    icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Explore),
                    href: `/${ZoneNavigationEnum.enum.Explore}`,
                    selected: false,
                    icon: (props: any) => <GlobeAltIcon className='w-4 h-4' />,
                  },
                ]}
              />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={organisation?.name || ''}
              href={routeBuilder(env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH, organisation?.name)}
            >
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={repository?.name || ''}
              href={routeBuilder(env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH, organisation?.name, repository?.name)}
            />
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: CollectionNavigationEnum.enum.Preview,
                href: routeBuilder(env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH, organisation?.name, repository?.name),
                enabled: false,
                loading: false,
              },
              {
                name: CollectionNavigationEnum.enum.Rarity,
                href: routeBuilder(
                  env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH,
                  organisation?.name,
                  repository?.name,
                  CollectionNavigationEnum.enum.Rarity,
                  layer?.name
                ),
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: CollectionNavigationEnum.enum.Rules,
                href: routeBuilder(
                  env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH,
                  organisation?.name,
                  repository?.name,
                  CollectionNavigationEnum.enum.Rules
                ),
                enabled: false,
                loading: false,
              },
              {
                name: CollectionNavigationEnum.enum.Deployments,
                href: routeBuilder(
                  env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH,
                  organisation?.name,
                  repository?.name,
                  CollectionNavigationEnum.enum.Deployments
                ),
                enabled: true,
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body border={'lower'}>
          <div className='w-full h-full'>
            <div className='h-32 flex items-center justify-between'>
              <h1 className='text-2xl font-semibold'>Deployments</h1>
              <div className='space-x-2'>
                <button
                  disabled={!repository?.bucket}
                  onClick={() => setIsCreateDialogOpen(true)}
                  className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
                >
                  Create Deployment
                </button>
              </div>
            </div>
            {collections && repository && (
              <RepositoryDeploymentCreateModal
                visible={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                repository={repository}
                collections={collections}
              />
            )}
          </div>

          {deployments && deployments.length > 0 ? (
            <div className='py-8'>
              {deployments.map((deployment, index) => (
                <div
                  key={deployment.id}
                  className={clsx(
                    'border-l border-r border-mediumGrey border-b p-4',
                    index === 0 && 'rounded-tl-[5px] rounded-tr-[5px] border-t',
                    index === deployments.length - 1 && 'rounded-bl-[5px] rounded-br-[5px]'
                  )}
                >
                  <RepositoryDeploymentPreviewCard
                    deployment={deployment}
                    organisationName={organisationName}
                    repositoryName={repositoryName}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
