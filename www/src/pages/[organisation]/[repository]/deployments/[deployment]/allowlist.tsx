import { useFetchContractData } from '@components/explore/SaleLayout/useFetchContractData'
import { Table } from '@components/layout/core/Table'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import SettingLayout from '@components/layout/settings'
import Textarea from '@components/layout/textarea/Textarea'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useMutateContractDeploymentWhitelistCreate } from '@hooks/trpc/contractDeploymentWhitelist/useMutateContractDeploymentWhitelistCreate'
import { useQueryContractDeploymentWhitelist } from '@hooks/trpc/contractDeploymentWhitelist/useQueryContractDeploymentWhitelist'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/repositoryContractDeployment/useQueryRepositoryDeployments'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { WhitelistType } from '@prisma/client'
import { parseChainId } from '@utils/ethers'
import { createMerkleTree } from '@utils/merkle_roots'
import { convertListToMap } from '@utils/object-utils'
import { getAddress } from 'ethers/lib/utils.js'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize, routeBuilder, toPascalCaseWithSpace } from 'src/client/utils/format'
import { timeAgo } from 'src/client/utils/time'
import { AssetDeploymentNavigationEnum, OrganisationNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

type AllowlistFormInput = {
  address: `0x${string}`
  mint: number
}[]

type AllowlistFormInputV2 = string

const Page: NextPage = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const { all: contractDeployment } = useQueryRepositoryContractDeployment()
  const { current: deployment, isLoading: isLoading } = useQueryRepositoryDeployments()
  const { current: repository } = useQueryRepositoryFindByName()
  const { current: whitelist } = useQueryContractDeploymentWhitelist({
    type: WhitelistType.ALLOWLIST,
  })
  const { mutate } = useMutateContractDeploymentWhitelistCreate({
    type: WhitelistType.ALLOWLIST,
  })
  const [dbPresaleMerkleRoot, setDbPresaleMerkleRoot] = useState<string | null>(null)
  const { data } = useFetchContractData({
    contractAddress: contractDeployment?.address || '',
    chainId: contractDeployment?.chainId || 99,
    enabled: !!contractDeployment?.address,
    version: '0.1.0',
  })

  useEffect(() => {
    if (!whitelist) return
    setDbPresaleMerkleRoot(
      createMerkleTree(
        convertListToMap(
          whitelist.map((x) => ({
            address: x.address,
            mint: String(x.mint),
          })),
          'address',
          'mint'
        )
      ).getHexRoot()
    )
  }, [whitelist])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    whitelist: AllowlistFormInputV2
  }>({
    defaultValues: {
      whitelist: '',
    },
  })

  if (!data) return null

  const { presaleMerkleRoot, claimMerkleRoot } = data

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
                name: AssetDeploymentNavigationEnum.enum.Allowlist,
                href: routeBuilder(
                  organisation?.name,
                  repository?.name,
                  ZoneNavigationEnum.enum.Deployments,
                  deployment?.name,
                  AssetDeploymentNavigationEnum.enum.Allowlist
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
            <div className='space-y-2'>
              <div className='w-full space-y-6'>
                <SettingLayout onSubmit={() => {}}>
                  <SettingLayout.Header title='Information' description="Here's some important information about your whitelist" />
                  <SettingLayout.Body>
                    {/* <div className='space-y-2'>
                          <div className='flex flex-col space-y-3'>
                            {[
                              {
                                label: 'Total Addresses',
                                value: whitelist?.length,
                              },
                            ].map(({ label, value }) => (
                              <div className='' key={label}>
                                <h3 className='font-semibold text-sm'>{label}</h3>
                                <span className='uppercase text-xs'>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div> */}
                    <div className='text-xs space-y-2'>
                      {presaleMerkleRoot !== dbPresaleMerkleRoot ? (
                        <span>
                          Your <strong>{toPascalCaseWithSpace(WhitelistType.ALLOWLIST)}</strong> is out of sync. You need to update the
                          contract on <strong>{capitalize(parseChainId(contractDeployment?.chainId || 99))}</strong> to sync up your
                          allowlist.
                        </span>
                      ) : (
                        <span>You do not have any items in your allowlist</span>
                      )}
                      <span className='block flex flex-col'>
                        <div>
                          <strong>Presale Merkle Root in Contract</strong> {presaleMerkleRoot}
                        </div>
                        <div>
                          <strong>Presale Merkle Root in Db</strong> {dbPresaleMerkleRoot}
                        </div>
                      </span>
                    </div>
                  </SettingLayout.Body>
                </SettingLayout>
                <div className='grid grid-cols-6 gap-6'>
                  <div className='col-span-2'></div>
                  <div className='col-span-4'>
                    <SettingLayout
                      disabled={false}
                      onSubmit={handleSubmit((data) => {
                        if (!contractDeployment?.id) return
                        const { whitelist } = data
                        // treat the value as a comma separated list and parse the address using ethers.utils.getAddress
                        const addresses: string[] = whitelist.split(',')
                        const parsedAllowlistFormInput: AllowlistFormInput = addresses.map((address) => {
                          return {
                            address: getAddress(address),
                            mint: 1,
                          }
                        })

                        mutate({
                          contractDeploymentId: contractDeployment?.id,
                          whitelist: parsedAllowlistFormInput,
                          type: WhitelistType.ALLOWLIST,
                        })
                      })}
                    >
                      <SettingLayout.Header title='Whitelist' description='Your whitelist....' />
                      <SettingLayout.Body>
                        <Textarea
                          {...register('whitelist', {
                            required: true,
                          })}
                          placeholder={repository?.description || ''}
                          defaultValue={repository?.description || ''}
                          rows={5}
                          wrap='soft'
                          aria-invalid={errors.whitelist ? 'true' : 'false'}
                        />
                      </SettingLayout.Body>
                    </SettingLayout>
                  </div>
                </div>

                <Table>
                  <Table.Head>
                    <span>Id</span>
                    <span>Mint Count</span>
                    <span>Address</span>
                    <span>Created At</span>
                    <span>Update At</span>
                  </Table.Head>
                  <Table.Body>
                    {whitelist?.map(({ address, mint, createdAt, updatedAt }, index) => (
                      <Table.Body.Row current={index} key={address} total={whitelist.length}>
                        <span>{index}</span>
                        <span>{mint}</span>
                        <span>{address}</span>
                        <span>{timeAgo(createdAt)}</span>
                        <span>{timeAgo(updatedAt)}</span>
                      </Table.Body.Row>
                    ))}
                  </Table.Body>
                </Table>
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
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
