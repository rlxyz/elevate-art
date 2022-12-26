import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import LinkComponent from '@components/layout/link/Link'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { Disclosure } from '@headlessui/react'
import { CheckCircleIcon, ChevronRightIcon, CubeIcon, GlobeAltIcon, XCircleIcon } from '@heroicons/react/solid'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/repositoryContractDeployment/useQueryRepositoryDeployments'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import type { ContractDeployment } from '@prisma/client'
import clsx from 'clsx'
import type { GetServerSidePropsContext } from 'next'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { parseChainId } from 'src/client/utils/ethers'
import { capitalize, routeBuilder, toPascalCaseWithSpace } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'
import { CollectionNavigationEnum, DeploymentNavigationEnum, MintNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'
import { z } from 'zod'

const Page = () => {
  const { all: contractDeployment } = useQueryRepositoryContractDeployment()
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
              href={`/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${repository?.name}`}
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
                enabled: false,
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
                enabled: true,
                loading: isLoading,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body border='lower'>
          <Header title={'Contract'} description={'You are viewing the contract information for this deployment.'}>
            <div className='flex flex-row items-center space-x-2'>
              <div className='flex space-x-1'>
                <h2 className='text-xs'>Address</h2>
                <h1 className='text-xs font-bold'>
                  <LinkComponent
                    target='_blank'
                    rel='noopener noreferrer'
                    href={routeBuilder(
                      env.NEXT_PUBLIC_MINT_CLIENT_BASE_PATH,
                      organisation?.name,
                      repository?.name,
                      MintNavigationEnum.enum.Preview,
                      contractDeployment?.address,
                      MintNavigationEnum.enum.Mint
                    )}
                    underline
                  >
                    Click here
                  </LinkComponent>
                </h1>
              </div>
              <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
              <div className='flex space-x-1'>
                <h2 className='text-xs'>Chain</h2>
                <h1 className='text-xs font-bold'>{capitalize(parseChainId(contractDeployment?.chainId || 0))}</h1>
              </div>
              <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
              <div className='flex space-x-1'>
                <h2 className='text-xs'>Branch</h2>
                <h1 className='text-xs font-bold'>{toPascalCaseWithSpace(contractDeployment?.assetDeployment?.branch || '')}</h1>
              </div>
              <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
              <div className='flex space-x-1'>
                <h2 className='text-xs'>Type</h2>
                <h1 className='text-xs font-bold'>{toPascalCaseWithSpace(contractDeployment?.assetDeployment?.type || '')}</h1>
              </div>
            </div>
          </Header>
          <Body>
            <ContractDeploymentPhasesView deployment={contractDeployment} />
          </Body>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export const ContractDeploymentPhasesEnum = z.nativeEnum(
  Object.freeze({
    Deploying: 'Deploying',
    Verification: 'Running Verification',
  })
)

export type ContractDeploymentPhasesType = z.infer<typeof ContractDeploymentPhasesEnum>

const ContractDeploymentPhasesView: FC<{ deployment: ContractDeployment | null | undefined }> = ({ deployment }) => {
  /** Infer status as PENDING. */
  const status = deployment?.status || 'PENDING'
  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-bold'>Deployment Status</h1>
      <div>
        <div>
          {[ContractDeploymentPhasesEnum.enum.Deploying, ContractDeploymentPhasesEnum.enum.Verification].map((phase, index) => (
            <Disclosure key={phase}>
              <Disclosure.Button
                className={clsx(
                  'border-l border-r border-mediumGrey border-b p-5 w-full',
                  index === 0 && 'rounded-tl-[5px] rounded-tr-[5px] border-t',
                  index === 2 - 1 && 'rounded-bl-[5px] rounded-br-[5px]'
                )}
              >
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-1'>
                    <ChevronRightIcon className='w-4 h-4' />
                    <h2 className='text-sm font-semibold'>{phase}</h2>
                  </div>

                  <div className='flex'>
                    {status === 'FAILED' ? (
                      <XCircleIcon className='w-5 h-5 text-redError' />
                    ) : (
                      <>
                        {status === 'PENDING' && <div className='w-5 h-5 border border-mediumGrey rounded-full' />}
                        {status === 'VERIFYING' && phase === ContractDeploymentPhasesEnum.enum.Deploying && (
                          <CheckCircleIcon className='w-5 h-5 text-blueHighlight' />
                        )}
                        {status === 'DEPLOYED' && <CheckCircleIcon className='w-5 h-5 text-blueHighlight' />}
                      </>
                    )}
                  </div>
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className={clsx('border-l border-r border-b border-mediumGrey p-5')}>
                <div className='text-xs space-x-6 flex'>
                  <span className='font-semibold'>{deployment?.createdAt.toLocaleTimeString()}</span>
                  <p>Address {deployment?.address}</p>
                </div>
              </Disclosure.Panel>
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  )
}

interface HeaderInterface {
  title: string
  description: string
  children?: ReactNode
}

const Header: FC<HeaderInterface> = ({ title, description, children }) => {
  return (
    <div className='h-32 flex items-center justify-between'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold'>{title}</h1>
        <p className='text-sm'>{description}</p>
        {children}
      </div>
    </div>
  )
}

interface BodyInterface {
  children?: ReactNode
}

const Body: FC<BodyInterface> = ({ children }) => {
  return <div className='py-8'>{children}</div>
}

export default withOrganisationStore(Page)

/**
 * If user is authenticated, redirect the user to his dashboard.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { organisation, repository, deployment } = context.query as { [key: string]: string }

  if (!organisation || !repository || !deployment) {
    return { props: {} }
  }

  const valid = await prisma?.contractDeployment.findFirst({
    where: {
      assetDeployment: {
        name: deployment,
        repository: {
          name: repository,
          organisation: {
            name: organisation,
          },
        },
      },
    },
  })

  if (valid) return { props: {} }

  return {
    redirect: {
      destination: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation}/${repository}/${CollectionNavigationEnum.enum.Deployments}/${deployment}/contract/new`,
      permanant: false,
    },
  }
}
