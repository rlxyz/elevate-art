import type { ContractData } from '@Components/ContractData'
import LinkComponent from '@Components/ui/link/Link'
import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import { ethers } from 'ethers'
import { current } from 'immer'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'

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
  contractData: ContractData
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
        <InfiniteScrollComponent.default
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
              .map((item) => (
                <div key={item} className='border border-mediumGrey rounded-[5px]'>
                  <Image
                    src={`${'http://localhost:3000'}/api/asset/${organisation.name}/${repository.name}/${assetDeployment?.name}/${item}`}
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
                        href={`${'http://localhost:3000'}/api/asset/${organisation.name}/${repository.name}/${
                          assetDeployment?.name
                        }/${item}/metadata`}
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
      )}
    </>
  )
}
