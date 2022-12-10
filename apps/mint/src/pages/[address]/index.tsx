import { MintLayout } from '@Components/core/MintLayout'
import { Layout } from '@Components/layout/core/Layout'
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
        <MintLayout>
          <MintLayout.Header contractDeployment={deployment} />
          <MintLayout.Description
            organisation={deployment.repository.organisation}
            repository={deployment.repository}
            deployment={deployment.repositoryDeployment} // @todo fix
            contractDeployment={deployment}
            contractData={contractData}
          />
          <MintLayout.Body contractDeployment={deployment} contractData={contractData} />
        </MintLayout>
      </Layout.Body>
    </Layout>
  )
}

export default HomePage
