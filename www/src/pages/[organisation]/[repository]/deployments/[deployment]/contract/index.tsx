import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import NextLinkComponent from '@components/layout/link/NextLink'
import withOrganisationStore from '@components/withOrganisationStore'
import { Disclosure } from '@headlessui/react'
import { CheckCircleIcon, ChevronRightIcon, XCircleIcon } from '@heroicons/react/solid'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/repositoryContractDeployment/useQueryRepositoryDeployments'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import type { RepositoryContractDeployment } from '@prisma/client'
import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { CollectionNavigationEnum, DeploymentNavigationEnum } from 'src/shared/enums'
import { z } from 'zod'

const Page = () => {
  const { all: contractDeployment } = useQueryRepositoryContractDeployment()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { mainRepositoryHref, repositoryName, organisationName, deploymentName } = useRepositoryRoute()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <OrganisationAuthLayout>
      <Layout>
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
            { current: deploymentName, href: `/${organisationName}/${repositoryName}/deployments/${deploymentName}` },
          ]}
        >
          <PageRoutesNavbar>
            {[
              {
                name: DeploymentNavigationEnum.enum.Overview,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}`,
                enabled: false,
                loading: false,
              },
              {
                name: DeploymentNavigationEnum.enum.Contract,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}/contract`,
                enabled: true,
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.Header>
        <Layout.Body border='lower'>
          <Header title={'Contracts'} description={'You are viewing the contract information for this deployment.'}>
            <NextLinkComponent
              href={`/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}/contract/new`}
              className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey w-fit'
            >
              New Contract
            </NextLinkComponent>
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

const ContractDeploymentPhasesView: FC<{ deployment: RepositoryContractDeployment | null | undefined }> = ({ deployment }) => {
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

interface ContractDeploymentFormInterface {
  children: ReactNode
}

const ContractDeploymentForm: FC<ContractDeploymentFormInterface> = ({ children }) => {
  return (
    <div className='border border-mediumGrey rounded-[5px] h-96 p-8'>
      {/* <div className='border border-mediumGrey rounded-[5px] h-full border-dotted'> */}
      <div className='flex flex-col h-full items-center justify-center space-y-3'>
        <div className='flex flex-col items-center'>
          <h1 className='text-xl font-bold'>Contract Setup</h1>
          <p className='text-xs'>You have yet to setup your contract for this deployment.</p>
        </div>
        <div>{children}</div>
      </div>
      {/* </div> */}
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
      </div>
      {children}
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
