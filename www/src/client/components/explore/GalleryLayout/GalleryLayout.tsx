import LinkComponent from '@components/layout/link/Link'
import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import type { RhapsodyContractData } from '@utils/contracts/ContractData'
import { ethers } from 'ethers'
import { current } from 'immer'
import { useEffect, useState } from 'react'
import InfiniteScrollComponent from 'react-infinite-scroll-component'
import { getDeploymentTokenImage, getDeploymentTokenMetadata } from 'src/client/utils/image'

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
                <div
                  key={`${contractDeployment.address}-${id}`}
                  className='border border-mediumGrey rounded-[5px] overflow-hidden text-ellipsis whitespace-nowrap'
                >
                  <img
                    src={getDeploymentTokenImage({
                      o: organisation.name,
                      r: repository.name,
                      tokenId: id,
                      d: assetDeployment?.name,
                      branch: assetDeployment?.branch,
                    })}
                    width={1000}
                    height={1000}
                    alt={`${contractDeployment.address}-#${id}`}
                    className='object-cover m-auto'
                  />
                  <div className='p-2'>
                    <h1 className='text-xs font-semibold'>
                      <LinkComponent
                        target='_blank'
                        rel='noopener noreferrer'
                        href={getDeploymentTokenMetadata({
                          o: organisation.name,
                          r: repository.name,
                          tokenId: id,
                          d: assetDeployment?.name,
                          branch: assetDeployment?.branch,
                        })}
                        underline
                      >
                        {repository.tokenName} #{id}
                      </LinkComponent>
                    </h1>
                  </div>
                </div>
              ))}
          </div>
        </InfiniteScrollComponent>
      )}
    </>
  )
}
