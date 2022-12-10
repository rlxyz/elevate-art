import { MintLayout } from '@Components/core/MintLayout'
import { Layout, LayoutContainer } from '@Components/layout/core/Layout'
import { RepositoryContractDeploymentStatus } from '@prisma/client'
import type { BigNumber } from 'ethers'
import LogRocket from 'logrocket'
import Image from 'next/image'
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
          <LayoutContainer border='none'>
            <div className='grid grid-cols-4 gap-6 py-6'>
              {Array.from(Array(20).keys()).map((item) => (
                <div key={item} className='border border-mediumGrey rounded-[5px]'>
                  <Image
                    src={`${'http://localhost:3000'}/api/asset/${deployment.repository.organisation.name}/${deployment.repository.name}/${
                      deployment.repositoryDeployment?.name
                    }/${item}`}
                    width={300}
                    height={300}
                    alt='some-id'
                    className='object-cover m-auto rounded-t-[5px]'
                  />
                  <div className='p-2'>
                    <h1 className='text-xs font-semibold italic'>{item}</h1>
                  </div>
                </div>
              ))}
            </div>
          </LayoutContainer>
        </MintLayout>
      </Layout.Body>
    </Layout>
  )
}

export default HomePage
