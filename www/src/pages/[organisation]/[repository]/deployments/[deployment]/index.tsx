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
import { AssetDeploymentNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

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
            <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)}>
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item label={repository?.name || ''} href={routeBuilder(organisation?.name, repository?.name)} />
            <AppRoutesNavbar.Item
              label={capitalize(ZoneNavigationEnum.enum.Deployments)}
              href={routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments)}
            >
              <ZoneRoutesNavbarPopover
                title='Apps'
                routes={[
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Create),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Create),
                    selected: false,
                    icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Deployments),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments),
                    selected: true,
                    icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Explore),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Explore),
                    selected: false,
                    icon: (props: any) => <GlobeAltIcon className='w-4 h-4' />,
                  },
                ]}
              />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={deployment?.name || ''}
              href={routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments, deployment?.name)}
            />
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: AssetDeploymentNavigationEnum.enum.Overview,
                href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments, deployment?.name),
                enabled: true,
                loading: isLoading,
              },
              {
                name: AssetDeploymentNavigationEnum.enum.Contract,
                href: routeBuilder(
                  organisation?.name,
                  repository?.name,
                  ZoneNavigationEnum.enum.Deployments,
                  deployment?.name,
                  AssetDeploymentNavigationEnum.enum.Contract
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
