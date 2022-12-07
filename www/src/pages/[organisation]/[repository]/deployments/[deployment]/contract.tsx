import withOrganisationStore from '@components/withOrganisationStore'
import { CheckCircleIcon, ChevronRightIcon, XCircleIcon } from '@heroicons/react/solid'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryContractDeployment } from '@hooks/trpc/repositoryContractDeployment/useQueryRepositoryDeployments copy'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { RepositoryContractDeployment } from '@prisma/client'
import clsx from 'clsx'
import { NextRouter, useRouter } from 'next/router'
import { FC, ReactNode, useEffect } from 'react'
import { HeaderInternalPageRoutes } from 'src/client/components/layout/core/Header'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { CollectionNavigationEnum, DeploymentNavigationEnum } from 'src/shared/enums'
import { z } from 'zod'

const Page = () => {
  const { setCollectionId, reset, setRepositoryId } = useRepositoryStore((state) => {
    return {
      setRepositoryId: state.setRepositoryId,
      setCollectionId: state.setCollectionId,
      reset: state.reset,
    }
  })

  useEffect(() => {
    reset()
  }, [])

  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const deploymentName: string = router.query.deployment as string
  const { current: layer, isLoading: isLoadingLayers } = useQueryLayerElementFindAll()
  const { all: collections, isLoading: isLoadingCollection, mutate } = useQueryCollectionFindAll()
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const { all: contractDeployment } = useQueryRepositoryContractDeployment()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { collectionName, mainRepositoryHref } = useRepositoryRoute()

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  useEffect(() => {
    if (!collections) return
    if (!collections.length) return
    const collection = collections.find((collection) => collection.name === collectionName)
    if (!collection) return
    setCollectionId(collection.id)
    // if (tokens.length === 0) return
    mutate({ collection })
  }, [isLoadingCollection])

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
          <HeaderInternalPageRoutes
            links={[
              {
                name: DeploymentNavigationEnum.enum.Overview,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}`,
                enabled: false,
                loading: isLoadingLayers,
              },
              {
                name: DeploymentNavigationEnum.enum.Contract,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}/contract`,
                enabled: true,
                loading: isLoadingLayers,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body border='lower'>
          <Header title={'Contracts'} description={'You are viewing the contract information for this deployment.'}>
            <button className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'>
              Deploy Contract
            </button>
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
        {[ContractDeploymentPhasesEnum.enum.Deploying, ContractDeploymentPhasesEnum.enum.Verification].map((phase, index) => (
          <div
            className={clsx(
              'border-l border-r border-mediumGrey border-b p-4',
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
          </div>
        ))}
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
