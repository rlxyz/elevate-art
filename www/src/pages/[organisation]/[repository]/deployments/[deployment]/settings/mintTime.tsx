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
import { capitalize, clsx, routeBuilder } from 'src/client/utils/format'
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
  const {
    data: { publicTime, presaleTime, claimTime },
  } = useFetchContractData({
    contractAddress: contractDeployment?.address || '',
    chainId: contractDeployment?.chainId || 99,
    enabled: !!contractDeployment?.address,
    version: '0.1.0',
  })

  let valueClaimTime = new Date()
  let valuePresaleTime = new Date()
  let valuePublicTime = new Date()
  let currentClaimTime = new Date()
  let currentPresaleTime = new Date()
  let currentPublicTime = new Date()

  if (claimTime !== undefined) {
    currentClaimTime = new Date(BigNumber.from(claimTime.toString()).toNumber())
    const unixTimestamp = Math.round(claimTime.toNumber() / 1000)
    valueClaimTime = new Date(unixTimestamp * 1000)
  }
  if (presaleTime !== undefined) {
    currentPresaleTime = new Date(BigNumber.from(presaleTime.toString()).toNumber())
    const unixTimestamp = Math.round(presaleTime.toNumber() / 1000)
    valuePresaleTime = new Date(unixTimestamp * 1000)
  }

  if (publicTime !== undefined) {
    currentPublicTime = new Date(BigNumber.from(publicTime.toString()).toNumber())
    const unixTimestamp = Math.round(publicTime.toNumber() / 1000)
    valuePublicTime = new Date(unixTimestamp * 1000)
  }

  const datetimeLocalClaimTime = valueClaimTime.toISOString().slice(0, 16)
  const datetimeLocalPresaleTime = valuePresaleTime.toISOString().slice(0, 16)
  const datetimeLocalPublicTime = valuePublicTime.toISOString().slice(0, 16)

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
                              <div>Claim Mint Time: {currentClaimTime?.toString()}</div>
                              <div>Presale Mint Time: {currentPresaleTime?.toString()}</div>
                              <div>Public Mint Time: {currentPublicTime?.toString()}</div>
                            </>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <div className={clsx('flex flex-col space-y-1 w-full')}>
                              <label className='text-xs font-semibold'>CLAIM TIME</label>
                              <input
                                className={clsx('border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2')}
                                value={datetimeLocalClaimTime}
                                type='datetime-local'
                                min={new Date().toISOString().split('.')[0]}
                                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('.')[0]}
                              />
                              <label className='text-xs font-semibold'>PRESALE MINT TIME </label>
                              <input
                                className={clsx('border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2')}
                                value={datetimeLocalPresaleTime}
                                type='datetime-local'
                                min={new Date().toISOString().split('.')[0]}
                                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('.')[0]}
                              />
                              <label className='text-xs font-semibold'>PUBLIC MINT TIME</label>
                              <input
                                className={clsx('border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2')}
                                value={datetimeLocalPublicTime}
                                type='datetime-local'
                                min={new Date().toISOString().split('.')[0]}
                                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('.')[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </SettingLayout.Body>
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
