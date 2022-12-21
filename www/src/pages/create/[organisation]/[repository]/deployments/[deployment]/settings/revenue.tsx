import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/repositoryContractDeployment/useQueryRepositoryDeployments'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import type { NextPage } from 'next'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { SettingsNavigations } from 'src/client/components/organisation/OrganisationSettings'
import { capitalize } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'
import {
  CollectionNavigationEnum,
  ContractSettingsNavigationEnum,
  DeploymentNavigationEnum,
  OrganisationNavigationEnum,
  ZoneNavigationEnum,
} from 'src/shared/enums'

const Page: NextPage = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const { all: contractDeployment } = useQueryRepositoryContractDeployment()
  const { current: deployment, isLoading: isLoading } = useQueryRepositoryDeployments()
  const { current: repository } = useQueryRepositoryFindByName()
  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Settings}>
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
                    selected: false,
                    icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Explore),
                    href: `/${ZoneNavigationEnum.enum.Explore}`,
                    selected: true,
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
              href={`/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}`}
            />
            <AppRoutesNavbar.Item
              label={deployment?.name || ''}
              href={`/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}/${CollectionNavigationEnum.enum.Deployments}/${deployment?.name}`}
            />
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: DeploymentNavigationEnum.enum.Deployment,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}/${CollectionNavigationEnum.enum.Deployments}/${deployment?.name}`,
                enabled: false,
                loading: isLoading,
              },
              {
                name: DeploymentNavigationEnum.enum.Contract,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}/${CollectionNavigationEnum.enum.Deployments}/${deployment?.name}/${DeploymentNavigationEnum.enum.Contract}`,
                enabled: false,
                loading: isLoading,
              },
              {
                name: DeploymentNavigationEnum.enum.Settings,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}/${CollectionNavigationEnum.enum.Deployments}/${deployment?.name}/${DeploymentNavigationEnum.enum.Settings}`,
                enabled: true,
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <div className='grid grid-cols-10 gap-x-6'>
              <div className='col-span-2'>
                <SettingsNavigations
                  routes={[
                    {
                      name: ContractSettingsNavigationEnum.enum.Details,
                      href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}/${CollectionNavigationEnum.enum.Deployments}/${deployment?.name}/${DeploymentNavigationEnum.enum.Settings}`,
                      selected: false,
                    },
                    {
                      name: ContractSettingsNavigationEnum.enum.Mechanics,
                      href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}/${CollectionNavigationEnum.enum.Deployments}/${deployment?.name}/${DeploymentNavigationEnum.enum.Settings}/${ContractSettingsNavigationEnum.enum.Mechanics}`,
                      selected: false,
                    },
                    {
                      name: ContractSettingsNavigationEnum.enum.Revenue,
                      href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}/${CollectionNavigationEnum.enum.Deployments}/${deployment?.name}/${DeploymentNavigationEnum.enum.Settings}/${ContractSettingsNavigationEnum.enum.Revenue}`,
                      selected: false,
                    },
                    {
                      name: ContractSettingsNavigationEnum.enum.Allowlist,
                      href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}/${CollectionNavigationEnum.enum.Deployments}/${deployment?.name}/${DeploymentNavigationEnum.enum.Settings}/${ContractSettingsNavigationEnum.enum.Allowlist}`,
                      selected: false,
                    },
                    {
                      name: ContractSettingsNavigationEnum.enum.Deploy,
                      href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}/${CollectionNavigationEnum.enum.Deployments}/${deployment?.name}/${DeploymentNavigationEnum.enum.Settings}/${ContractSettingsNavigationEnum.enum.Deploy}`,
                      selected: false,
                    },
                  ]}
                />
              </div>
              <div className='col-span-8'>
                <div className='space-y-6'>
                  <h1>Revenue</h1>
                  {/* <OrganisationTeamAddUser />
                  <OrganisationTeamDisplayUsers />
                  <OrganisationTeamDisplayPending /> */}
                </div>
              </div>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
