import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import type { RhapsodyContractData } from '@utils/contracts/ContractData'
import { ethers } from 'ethers'
import { current } from 'immer'
import { useEffect, useState } from 'react'
import InfiniteScrollComponent from 'react-infinite-scroll-component'
import { GalleryLayoutCard } from './GalleryLayoutCard'

export const GalleryLayout = ({
  contractDeployment,
  contractData,
  assetDeployment,
  repository,
  organisation,
}: {
  contractDeployment: ContractDeployment
  assetDeployment: AssetDeployment
  repository: Repository
  organisation: Organisation
  contractData: RhapsodyContractData
}) => {
  const [displayLength, setDisplayLength] = useState<number>(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    reset()
    fetch()
  }, [contractDeployment?.address])

  const fetch = () => {
    setDisplayLength((prev) => prev + 25)
  }

  const reset = () => {
    setDisplayLength(0)
    setHasMore(true)
  }

  const fetchMoreData = () => {
    if (!current) return
    if (!assetDeployment) return
    if (displayLength + 25 > assetDeployment.totalSupply) {
      setHasMore(false)
      return
    }
    return fetch()
  }

  const totalSupply = Number(ethers.utils.formatUnits(contractData.totalSupply, 0))

  return (
    <>
      {totalSupply === 0 ? (
        <span className='text-xs w-full'>Nothing has been minted yet. Come back later.</span>
      ) : (
        <InfiniteScrollComponent
          dataLength={displayLength}
          next={() => {
            fetchMoreData()
          }}
          hasMore={hasMore}
          loader={<></>}
        >
          <div className='grid grid-cols-4 gap-6'>
            {Array.from(Array(totalSupply).keys())
              .slice(0, displayLength)
              .map((id) => (
                <GalleryLayoutCard
                  chainId={contractDeployment.chainId}
                  key={`${contractDeployment.address}-${id}`}
                  address={contractDeployment.address}
                  deploymentName={assetDeployment.name}
                  branch={assetDeployment.branch}
                  repositoryName={repository.name}
                  organisationName={organisation.name}
                  tokenName={repository.tokenName}
                  tokenId={id}
                />
              ))}
          </div>
        </InfiniteScrollComponent>
      )}
    </>
  )
}
