import type { ContractDetailsForm } from '@components/contractDeployment/ContactCreationForms/ContactDetailsForm'
import { ContractForm } from '@components/contractDeployment/ContractForm'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { SettingNavigation } from '@components/layout/settings/SettingNavigation'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useContractCreationStore } from '@hooks/store/useContractCreationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/repositoryContractDeployment/useQueryRepositoryDeployments'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
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

  const {
    currentSegment,
    contractName,
    contractSymbol,
    mintType,
    blockchain,
    artCollection,
    setContractName,
    setContractSymbol,
    setMintType,
    setBlockchain,
    setCurrentSegment,
    setArtCollection,
  } = useContractCreationStore()

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      contractName: contractName,
      contractSymbol: contractSymbol,
      mintType: mintType,
      blockchain: blockchain,
      artCollection: artCollection,
    },
  })

  const onSubmit = ({ contractName, contractSymbol, mintType, blockchain, artCollection }: ContractDetailsForm) => {
    setContractName(contractName)
    setContractSymbol(contractSymbol)
    setMintType(mintType)
    setBlockchain(blockchain)
    setArtCollection(artCollection)
    setCurrentSegment(currentSegment + 1)
  }

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
                <SettingNavigation
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
                <div className='space-y-2'>
                  <h1 className='font-semibold py-2'>Mechanics</h1>
                  <form onSubmit={onSubmit} className='w-3/4'>
                    <div className='w-full '>
                      <ContractForm.Body.Input
                        {...register('contractSymbol', {
                          required: true,
                          maxLength: {
                            value: 6,
                            message: 'Max length is 6',
                          },
                          minLength: {
                            value: 3,
                            message: 'Min length is 3',
                          },

                          pattern: /^[-/a-z0-9 ]+$/gi,
                          onChange: (e) => {
                            setValue('contractSymbol', e.target.value.toUpperCase())
                          },
                        })}
                        label={'Add Wallet Addresses Individually'}
                        description={'Add wallet addresses one at a time'}
                        className='col-span-2'
                        placeholder={`0x1b...148e`}
                        error={errors.contractSymbol}
                        maxLength={6}
                      />
                    </div>
                    <button
                      className='col-span-7 border p-2 border-mediumGrey rounded-[5px] bg-black text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
                      type='submit'
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
