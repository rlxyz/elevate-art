import AvatarComponent from '@components/layout/avatar/Avatar'
import LinkComponent from '@components/layout/link/Link'
import NextLinkComponent from '@components/layout/link/NextLink'
import type { ContractDeployment, Repository } from '@prisma/client'
import { buildEtherscanLink, formatEthereumHash } from '@utils/ethers'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getOwnerOf, getTokenMetadataURI, getTokenURI } from 'src/client/utils/image'

export const GalleryLayoutCard = ({
  repository,
  contractDeployment,
  tokenId,
  tokenName,
}: {
  repository: Repository
  contractDeployment: ContractDeployment
  tokenName: string
  tokenId: number
}) => {
  const { address, chainId } = contractDeployment
  const [owner, setOwner] = useState<string>('0x0000000000000000000000000000000000000000')

  // fetch owner from from api/assets/:chainId/:contractAddress/:tokenId/owner
  const fetchOwner = async () => {
    try {
      const response = await fetch(
        getOwnerOf({
          contractDeployment,
          tokenId,
        })
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
      return error
    }
  }

  useEffect(() => {
    fetchOwner().then((x) => {
      if (x?.address) setOwner(x.address)
    })
  }, [])

  return (
    <div
      key={`${address}-${tokenId}`}
      className='border border-mediumGrey rounded-[5px] overflow-hidden text-ellipsis whitespace-nowrap shadow-sm'
    >
      <Image
        src={getTokenURI({ contractDeployment, tokenId })}
        onErrorCapture={(e) => {
          e.currentTarget.src = '/images/placeholder.png'
        }}
        width={repository.width || 600}
        height={repository.height || 600}
        alt={`${address}-#${tokenId}`}
        className='object-cover m-auto bg-lightGray'
      />
      <div className='space-y-1 pt-2 px-2 flex justify-between'>
        <div className=''>
          <h1 className='text-xs font-semibold'>
            <LinkComponent
              target='_blank'
              rel='noopener noreferrer'
              href={getTokenMetadataURI({
                contractDeployment,
                tokenId,
              })}
              underline
            >
              {tokenName} #{tokenId}
            </LinkComponent>
          </h1>
          {owner && (
            <NextLinkComponent
              target='_blank'
              rel='noopener noreferrer'
              href={buildEtherscanLink({
                chainId,
                address: owner,
              })}
              underline
            >
              <div className='flex items-center space-x-2'>
                <AvatarComponent src='/images/avatar-blank.png' />
                <span className='text-xs'>{formatEthereumHash(owner)}</span>
              </div>
            </NextLinkComponent>
          )}
        </div>
        <div>
          <NextLinkComponent
            href={`https://${contractDeployment.chainId !== 1 ? 'testnets.' : ''}opensea.io/assets/${
              contractDeployment.address
            }/${tokenId}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              alt={`opensea-link-${tokenId}`}
              width={40}
              height={40}
              src='/images/opensea.svg'
              className='w-5 h-5 border rounded-full border-mediumGrey'
            />
          </NextLinkComponent>
        </div>
      </div>
    </div>
  )
}
