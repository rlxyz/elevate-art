import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { SettingNavigation } from '@components/layout/settings/SettingNavigation'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useMutateContractDeploymentWhitelistCreate } from '@hooks/trpc/contractDeploymentWhitelist/useMutateContractDeploymentWhitelistCreate'
import { useQueryContractDeploymentWhitelist } from '@hooks/trpc/contractDeploymentWhitelist/useQueryContractDeploymentWhitelist'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/repositoryContractDeployment/useQueryRepositoryDeployments'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
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
  const { current: whitelist } = useQueryContractDeploymentWhitelist()
  const { mutate } = useMutateContractDeploymentWhitelistCreate()
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm()

  const contractDeploymentAddress = contractDeployment?.address

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
              label={deployment?.name || ''}
              href={`/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}`}
            />
            <AppRoutesNavbar.Item
              label={capitalize(ZoneNavigationEnum.enum.Deployments)}
              href={`/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}/${ZoneNavigationEnum.enum.Deployments}`}
            >
              <ZoneRoutesNavbarPopover
                title='Apps'
                routes={[
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Deployments),
                    href: `/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}/${ZoneNavigationEnum.enum.Deployments}`,
                    selected: true,
                    icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Create),
                    href: `/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}/${ZoneNavigationEnum.enum.Create}`,
                    selected: false,
                    icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Explore),
                    href: `/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}/${ZoneNavigationEnum.enum.Explore}`,
                    selected: false,
                    icon: (props: any) => <GlobeAltIcon className='w-4 h-4' />,
                  },
                ]}
              />
            </AppRoutesNavbar.Item>
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: AssetDeploymentNavigationEnum.enum.Overview,
                href: `/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}`,
                enabled: false,
                loading: isLoading,
              },
              {
                name: AssetDeploymentNavigationEnum.enum.Contract,
                href: `/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}/${AssetDeploymentNavigationEnum.enum.Contract}`,
                enabled: false,
                loading: isLoading,
              },
              {
                name: AssetDeploymentNavigationEnum.enum.Settings,
                href: `/${organisation?.name}/${repository?.name}/${ZoneNavigationEnum.enum.Deployments}/${deployment?.name}/${DeploymentNavigationEnum.enum.Settings}`,
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
                <SettingNavigation
                  routes={[
                    {
                      name: ContractSettingsNavigationEnum.enum.Details,
                      href: routeBuilder(
                        organisation?.name,
                        repository?.name,
                        ZoneNavigationEnum.enum.Deployments,
                        deployment?.name,
                        DeploymentNavigationEnum.enum.Settings
                      ),
                      selected: false,
                    },
                    {
                      name: ContractSettingsNavigationEnum.enum.Mechanics,
                      href: routeBuilder(
                        organisation?.name,
                        repository?.name,
                        ZoneNavigationEnum.enum.Deployments,
                        deployment?.name,
                        DeploymentNavigationEnum.enum.Settings,
                        ContractSettingsNavigationEnum.enum.Mechanics
                      ),
                      selected: false,
                    },
                    {
                      name: ContractSettingsNavigationEnum.enum.Revenue,
                      href: routeBuilder(
                        organisation?.name,
                        repository?.name,
                        ZoneNavigationEnum.enum.Deployments,
                        deployment?.name,
                        DeploymentNavigationEnum.enum.Settings,
                        ContractSettingsNavigationEnum.enum.Revenue
                      ),
                      selected: false,
                    },
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
                      name: ContractSettingsNavigationEnum.enum.Deploy,
                      href: routeBuilder(
                        organisation?.name,
                        repository?.name,
                        ZoneNavigationEnum.enum.Deployments,
                        deployment?.name,
                        DeploymentNavigationEnum.enum.Settings,
                        ContractSettingsNavigationEnum.enum.Deploy
                      ),
                      selected: false,
                    },
                  ]}
                />
              </div>
              <div className='col-span-8'>
                <div className='space-y-2'>
                  <h1 className='font-semibold py-2'>Allowlist</h1>
                  <form className='w-3/4'>
                    <div className='w-full '>
                      <p>Contract Address: {contractDeploymentAddress}</p>
                      <span>{whitelist?.length}</span>
                      {/* <ContractForm.Body.Input
                        {...register('address', {
                          required: false,
                          maxLength: {
                            value: 18,
                            message: 'Max length is 18',
                          },
                          minLength: {
                            value: 18,
                            message: 'Min length is 18',
                          },

                          pattern: /^[-/a-z0-9 ]+$/gi,
                          onChange: (e) => {
                            setValue('address', e.target.value.toUpperCase())
                          },
                        })}
                        label={'Add Wallet Addresses Individually'}
                        description={'Add wallet addresses one at a time'}
                        className='col-span-2'
                        placeholder={`0x1b...148e`}
                        error={errors.address}
                        maxLength={6}
                      /> */}
                    </div>
                    <button
                      className='col-span-7 border p-2 border-mediumGrey rounded-[5px] bg-black text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
                      type='button'
                      onClick={(e) => {
                        if (!contractDeployment?.id) return

                        mutate({
                          contractDeploymentId: contractDeployment?.id,
                        })
                      }}
                    >
                      Save
                    </button>
                  </form>
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
