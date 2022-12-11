import { AnalyticsLayoutCollectionInformation } from '@Components/AnalyticsLayout/AnalyticsLayoutCollectionInformation'
import { AnalyticsLayoutCollectorData } from '@Components/AnalyticsLayout/AnalyticsLayoutCollectorData'
import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { MintLayout } from '@Components/MintLayout/MintLayout'
import { Layout } from '@Components/ui/core/Layout'
import { RepositoryContractDeploymentStatus } from '@prisma/client'
import type { BigNumber } from 'ethers'
import LogRocket from 'logrocket'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'
import { useAccount } from 'wagmi'

// @todo find somewhere to put this
export type ContractData = {
  projectOwner: string
  ethPrice: BigNumber
  maxAllocationPerAddress: BigNumber
  totalSupply: BigNumber
  presaleStartTime: Date
  publicStartTime: Date
}

export const HomePage = () => {
  const router = useRouter()
  const address = router.query.address as string
  const { current } = useQueryContractDeployment()
  const account = useAccount()
  useEffect(() => {
    if (account?.address) {
      LogRocket.identify(account?.address)
    }
  }, [account?.address])

  if (!current || !current.deployment || !(current.deployment.status === RepositoryContractDeploymentStatus.DEPLOYED)) return <></>

  const { deployment, contract: contractData } = current

  return (
    <Layout>
      <Layout.Header
        internalRoutes={[
          {
            current: `${address}`,
            href: `/${address}`,
          },
        ]}
      />
      <Layout.Body margin={false}>
        <CollectionLayout>
          <CollectionLayout.Header contractDeployment={deployment} />
          <CollectionLayout.Description
            organisation={deployment.repository.organisation}
            repository={deployment.repository}
            deployment={deployment.repositoryDeployment} // @todo fix
            contractDeployment={deployment}
            contractData={contractData}
          />
          <CollectionLayout.Body>
            <div className='w-full justify-center flex flex-col gap-6 md:grid md:grid-flow-col md:grid-cols-2'>
              <main>
                <MintLayout contractDeployment={deployment} />
              </main>
              <article className='flex flex-col space-y-6'>
                <AnalyticsLayoutCollectionInformation contractDeployment={deployment} />
                <AnalyticsLayoutCollectorData contractDeployment={deployment} />
              </article>
            </div>
          </CollectionLayout.Body>
        </CollectionLayout>
      </Layout.Body>
    </Layout>
  )
}

export default HomePage
