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
          <MintLayout.Header bannerImageUrl={'/images/moonbirds-banner.png'} profileImageUrl={'/images/moonbirds-profile.avif'} />
          <MintLayout.Description
            organisation={deployment.repository.organisation}
            repository={deployment.repository}
            deployment={deployment.repositoryDeployment} // @todo fix
            contractDeployment={deployment}
            contractData={contractData}
          />
          <MintLayout.Body contractDeployment={deployment} />
          {/* <div className='px-5 lg:px-16 2xl:px-32 py-12 pb-20 grid gap-4 grid-cols-1 md:grid-cols-2'>
            <ProjectInfo
              projectName={data?.projectName}
              projectDescription={data?.projectDescription}
              bannerImageUrl={data?.projectInfoBanner}
              discordUrl={data?.discordUrl}
              twitterUrl={data?.twitterUrl}
              openseaUrl={data?.openseaUrl}
              price={data?.ethPrice}
              supply={data?.totalSupply}
            />
            <div className='ml-5'>
              <MintSection />
            </div>
          </div> */}
        </MintLayout>
      </Layout.Body>
    </Layout>
  )
}

export default HomePage
