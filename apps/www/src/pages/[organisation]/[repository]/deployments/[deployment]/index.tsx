import { ContractDeployedView } from '@components/deployments/contractDeployment/ContractDeploymentAdmin/ContractDeployedView'
import { ContractNotDeployedView } from '@components/deployments/contractDeployment/ContractDeploymentAdmin/ContractNotDeployedView'
import { FilterWithTextLive } from '@components/layout/FilterWithTextLive'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { TextWithStatus } from '@components/layout/TextWithStatus'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/contractDeployment/useQueryRepositoryDeployments'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryHasProductionDeployment } from '@hooks/trpc/repository/useQueryRepositoryHasProductionDeployment'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { getDeploymentTokenImage } from 'src/client/utils/image'
import { timeAgo } from 'src/client/utils/time'
import { AssetDeploymentNavigationEnum, ContractSettingsNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

const Page = () => {
  const { current: deployment, isLoading: isLoading } = useQueryRepositoryDeployments()
  const { current: organisation } = useQueryOrganisationFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
  const { current: hasProductionDeployment } = useQueryRepositoryHasProductionDeployment()
  const { all: contractDeployment } = useQueryRepositoryContractDeployment()

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  return (
    <OrganisationAuthLayout>
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
                ]}
              />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={<TextWithStatus name={deployment?.name} />}
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
                loading: !organisation?.name || !repository?.name || !deployment?.name,
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
                enabled: false,
                loading: !organisation?.name || !repository?.name || !deployment?.name,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body border={'lower'}>
          {organisation && repository && deployment ? (
            <>
              {contractDeployment ? (
                <ContractDeployedView
                  contractDeployment={contractDeployment}
                  organisation={organisation}
                  repository={repository}
                  assetDeployment={deployment}
                />
              ) : (
                <ContractNotDeployedView organisation={organisation} repository={repository} deployment={deployment} />
              )}
            </>
          ) : (
            <></>
          )}

          {deployment && (
            <div className='grid grid-cols-6 gap-9 py-16'>
              <div className='col-span-2'>
                <div className='border w-full h-52 border-blueHighlight rounded-[5px] overflow-hidden text-ellipsis whitespace-nowrap'>
                  {organisation && repository && (
                    <img
                      src={getDeploymentTokenImage({
                        o: organisation?.name,
                        r: repository?.name,
                        tokenId: 0,
                        d: deployment?.name,
                        branch: deployment?.branch,
                      })}
                      width={1000}
                      alt={`${deployment?.contractDeployment?.address}-#${0}`}
                      className='object-cover aspect-1 m-auto rounded-[5px]'
                    />
                  )}
                </div>
              </div>
              <div className='col-span-3'>
                <div className='grid grid-cols-3 gap-6'>
                  {[
                    {
                      label: 'Status',
                      value: deployment.status,
                    },
                    {
                      label: 'Environment',
                      value: deployment.branch,
                    },
                    {
                      label: 'Type',
                      value: deployment.type,
                    },
                    {
                      label: 'Total Supply',
                      value: deployment.totalSupply,
                    },
                    {
                      label: 'Created',
                      value: timeAgo(deployment.createdAt),
                    },
                  ].map((x) => (
                    <div key={x.label} className='flex flex-col space-y-1'>
                      <div className='text-xs uppercase text-darkGrey font-semibold'>{x.label}</div>
                      <div className='text-sm text-black font-semibold'>{x.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
