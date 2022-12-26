import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'
import { CollectionNavigationEnum, DeploymentNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

const Page = () => {
  const { current: deployment, isLoading: isLoading } = useQueryRepositoryDeployments()
  const { current: organisation } = useQueryOrganisationFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
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
              href={`/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}`}
            >
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={repository?.name || ''}
              href={routeBuilder(env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH, organisation?.name, repository?.name)}
            />
            <AppRoutesNavbar.Item
              label={deployment?.name || ''}
              href={routeBuilder(
                env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH,
                organisation?.name,
                repository?.name,
                CollectionNavigationEnum.enum.Deployments,
                deployment?.name
              )}
            />
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: DeploymentNavigationEnum.enum.Deployment,
                href: routeBuilder(
                  env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH,
                  organisation?.name,
                  repository?.name,
                  CollectionNavigationEnum.enum.Deployments,
                  deployment?.name
                ),
                enabled: true,
                loading: isLoading,
              },
              {
                name: DeploymentNavigationEnum.enum.Contract,
                href: routeBuilder(
                  env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH,
                  organisation?.name,
                  repository?.name,
                  CollectionNavigationEnum.enum.Deployments,
                  deployment?.name,
                  DeploymentNavigationEnum.enum.Contract
                ),
                enabled: false,
                loading: isLoading,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
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
