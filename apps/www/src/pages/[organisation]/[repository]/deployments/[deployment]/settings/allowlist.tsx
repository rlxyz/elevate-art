import { AllowlistLayout } from '@components/create/allowlist/AllowlistLayout'
import { FilterWithTextLive } from '@components/layout/FilterWithTextLive'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { SettingNavigation } from '@components/layout/settings/SettingNavigation'
import { TextWithStatus } from '@components/layout/TextWithStatus'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon } from '@heroicons/react/outline'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/contractDeployment/useQueryRepositoryDeployments'
import { useQueryContractDeploymentWhitelist } from '@hooks/trpc/contractDeploymentWhitelist/useQueryContractDeploymentWhitelist'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryHasProductionDeployment } from '@hooks/trpc/repository/useQueryRepositoryHasProductionDeployment'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { ContractDeploymentAllowlistType } from '@prisma/client'
import type { NextPage } from 'next'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import {
  AssetDeploymentNavigationEnum,
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
  const { all: allowlists } = useQueryContractDeploymentWhitelist({
    type: ContractDeploymentAllowlistType.PRESALE,
  })
  const { current: hasProductionDeployment } = useQueryRepositoryHasProductionDeployment()
  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Settings}>
      <Layout>
        <Layout.AppHeader>
          <AppRoutesNavbar>
            <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)} loading={!organisation?.name}>
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={repository?.name || ''}
              href={routeBuilder(organisation?.name, repository?.name)}
              loading={!organisation?.name || !repository?.name}
              disabled={!hasProductionDeployment}
            >
              <FilterWithTextLive />
            </AppRoutesNavbar.Item>

            <AppRoutesNavbar.Item
              label={capitalize(ZoneNavigationEnum.enum.Deployments)}
              href={routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments)}
            >
              <ZoneRoutesNavbarPopover
                title='Apps'
                routes={[
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Deployments),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments),
                    // `/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}/${ZoneNavigationEnum.enum.Deployments}`,
                    selected: true,
                    icon: () => <CubeIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Create),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Create),
                    selected: false,
                    icon: () => <TriangleIcon className='w-4 h-4' />,
                  },
                ]}
              />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={<TextWithStatus name={deployment?.name} />}
              href={`/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}`}
            />
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: AssetDeploymentNavigationEnum.enum.Overview,
                href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments, deployment?.name),
                enabled: false,
                loading: !organisation?.name || !repository?.name || !deployment?.name,
                disabled: !organisation?.name || !repository?.name || !deployment?.name,
              },
              {
                name: AssetDeploymentNavigationEnum.enum.Settings,
                href: routeBuilder(
                  organisation?.name,
                  repository?.name,
                  ZoneNavigationEnum.enum.Deployments,
                  deployment?.name,
                  AssetDeploymentNavigationEnum.enum.Settings,
                  ContractSettingsNavigationEnum.enum.Allowlist
                ),
                enabled: true,
                loading: !organisation?.name || !repository?.name || !deployment?.name,
                disabled: !organisation?.name || !repository?.name || !deployment?.name,
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
                <SettingNavigation
                  routes={[
                    {
                      name: ContractSettingsNavigationEnum.enum.Allowlist,
                      href: routeBuilder(
                        organisation?.name,
                        repository?.name,
                        ZoneNavigationEnum.enum.Deployments,
                        deployment?.name,
                        DeploymentNavigationEnum.enum.Settings,
                        ContractSettingsNavigationEnum.enum.Allowlist
                      ),
                      selected: true,
                    },
                    {
                      name: ContractSettingsNavigationEnum.enum.Claimlist,
                      href: routeBuilder(
                        organisation?.name,
                        repository?.name,
                        ZoneNavigationEnum.enum.Deployments,
                        deployment?.name,
                        DeploymentNavigationEnum.enum.Settings,
                        ContractSettingsNavigationEnum.enum.Claimlist
                      ),
                      selected: false,
                    },
                    {
                      name: ContractSettingsNavigationEnum.enum.MintTime,
                      href: routeBuilder(
                        organisation?.name,
                        repository?.name,
                        ZoneNavigationEnum.enum.Deployments,
                        deployment?.name,
                        DeploymentNavigationEnum.enum.Settings,
                        ContractSettingsNavigationEnum.enum.MintTime
                      ),
                      selected: false,
                    },
                  ]}
                />
              </div>
              <div className='col-span-8'>
                <div className='space-y-6'>
                  {contractDeployment && allowlists && (
                    <AllowlistLayout
                      contractDeployment={contractDeployment}
                      whitelist={allowlists}
                      type={ContractDeploymentAllowlistType.PRESALE}
                    />
                  )}
                  {!contractDeployment && <span>You must deploy your Contract before your are able to create an Allowlist</span>}
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
