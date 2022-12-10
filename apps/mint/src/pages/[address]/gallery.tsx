import { MintLayout } from '@Components/core/MintLayout'
import { Layout, LayoutContainer } from '@Components/layout/core/Layout'
import LinkComponent from '@Components/layout/link/Link'
import { RepositoryContractDeploymentStatus } from '@prisma/client'
import LogRocket from 'logrocket'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'
import { useAccount } from 'wagmi'

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

  const [displayLength, setDisplayLength] = useState<number>(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    reset()
    fetch()
  }, [current?.deployment?.address])

  const fetch = () => {
    setDisplayLength((prev) => prev + 25)
  }

  const reset = () => {
    setDisplayLength(0)
    setHasMore(true)
  }

  const fetchMoreData = () => {
    if (!current) return
    if (!current.deployment?.repositoryDeployment) return
    if (displayLength + 25 > current.deployment.repositoryDeployment.collectionTotalSupply) {
      setHasMore(false)
      return
    }
    return fetch()
  }

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
            <InfiniteScrollComponent.default
              dataLength={displayLength}
              next={() => {
                fetchMoreData()
              }}
              hasMore={hasMore}
              loader={<></>}
            >
              <div className='grid grid-cols-4 gap-6 py-6'>
                {/** @todo should use current.contract.totalSupply */}
                {Array.from(Array(current.deployment.repositoryDeployment?.collectionTotalSupply).keys())
                  .slice(0, displayLength)
                  .map((item) => (
                    <div key={item} className='border border-mediumGrey rounded-[5px]'>
                      <Image
                        src={`${'http://localhost:3000'}/api/asset/${deployment.repository.organisation.name}/${
                          deployment.repository.name
                        }/${deployment.repositoryDeployment?.name}/${item}`}
                        width={300}
                        height={300}
                        alt='some-id'
                        className='object-cover m-auto rounded-t-[5px]'
                      />
                      <div className='p-2'>
                        <h1 className='text-xs font-semibold italic'>
                          <LinkComponent
                            target='_blank'
                            rel='noopener noreferrer'
                            href={`${'http://localhost:3000'}/api/asset/${deployment.repository.organisation.name}/${
                              deployment.repository.name
                            }/${deployment.repositoryDeployment?.name}/${item}/metadata`}
                            underline
                          >
                            {item}
                          </LinkComponent>
                        </h1>
                      </div>
                    </div>
                  ))}
              </div>
            </InfiniteScrollComponent.default>
          </LayoutContainer>
        </MintLayout>
      </Layout.Body>
    </Layout>
  )
}

export default HomePage
