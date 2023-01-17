import { useFetchContractData } from '@components/explore/SaleLayout/useFetchContractData'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import SettingLayout from '@components/layout/settings'
import { SettingNavigation } from '@components/layout/settings/SettingNavigation'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/contractDeployment/useQueryRepositoryDeployments'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { BigNumber } from 'ethers'
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
import { TextWithStatus } from '../../../../../../client/components/layout/TextWithStatus'

const Page: NextPage = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const { all: contractDeployment } = useQueryRepositoryContractDeployment()
  const { current: deployment, isLoading: isLoading } = useQueryRepositoryDeployments()
  const { current: repository } = useQueryRepositoryFindByName()
  const { data } = useFetchContractData({
    contractAddress: contractDeployment?.address || '',
    chainId: contractDeployment?.chainId || 99,
    enabled: !!contractDeployment?.address,
    version: '0.1.0',
  })

  let claimTime = null
  let presaleTime = null
  let publicTime = null

  if (data.claimTime !== undefined) {
    claimTime = new Date(BigNumber.from(data.claimTime.toString()).toNumber())
  }
  if (data.presaleTime !== undefined) {
    presaleTime = new Date(BigNumber.from(data.presaleTime.toString()).toNumber())
  }
  if (data.publicTime !== undefined) {
    publicTime = new Date(BigNumber.from(data.publicTime.toString()).toNumber())
  }

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Settings}>
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
                    label: capitalize(ZoneNavigationEnum.enum.Deployments),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments),
                    // `/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}/${ZoneNavigationEnum.enum.Deployments}`,
                    selected: true,
                    icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Create),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Create),
                    selected: false,
                    icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
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
                loading: isLoading,
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
                      selected: false,
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
                      selected: true,
                    },
                  ]}
                />
              </div>
              <div className='col-span-8'>
                <div className='space-y-6'>
                  <SettingLayout>
                    <SettingLayout.Header title='Mint Time' />
                    <SettingLayout.Body>
                      <div className='space-y-6'>
                        <div className='space-y-2'>
                          <div className='text-sm text-gray-500'>
                            The mint time is the time that the NFT will be minted at. This is useful for NFTs that have a specific time in
                            their story.
                          </div>
                          <div className='text-sm text-gray-500'>
                            If you do not set a mint time, the NFT will be minted at the time of the transaction.
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <div className='text-sm text-gray-500'>
                            <>
                              <div>Claim Mint Time: {claimTime?.toString()}</div>
                              <div>Presale Mint Time: {presaleTime?.toString()}</div>
                              <div>Public Mint Time: {publicTime?.toString()}</div>
                            </>
                          </div>
                          <div className='flex items-center space-x-2'>
                            {/* <input
                              {...register(`saleConfigs.${index}.startTimestamp`, {
                                required: true,
                                valueAsDate: true,
                                onChange: (e) => {
                                  if (e.target.value) {
                                    setValue(`saleConfigs.${index}.startTimestamp`, e.target.value)
                                  }
                                },
                              })}
                              label={'Start Time'}
                              className='col-span-3'
                            /> */}
                          </div>
                        </div>
                      </div>
                    </SettingLayout.Body>
                    {/* <SettingLayout.Footer>
                      <Button variant='primary' size='small' onClick={() => {}}>
                        Save
                      </Button>
                    </SettingLayout.Footer> */}
                  </SettingLayout>
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
