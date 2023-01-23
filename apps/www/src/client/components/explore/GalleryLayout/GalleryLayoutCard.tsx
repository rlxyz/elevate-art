import AvatarComponent from '@components/layout/avatar/Avatar'
import LinkComponent from '@components/layout/link/Link'
import NextLinkComponent from '@components/layout/link/NextLink'
import type { ContractDeployment, Repository } from '@prisma/client'
import { buildEtherscanLink, formatEthereumHash } from '@utils/ethers'
import Image from 'next/image'
import { getTokenMetadataURI, getTokenURI } from 'src/client/utils/image'
import { useFetchContractTokenData } from '../SaleLayout/useFetchContractData'

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

  const { data } = useFetchContractTokenData({
    contractAddress: address,
    tokenId,
    chainId,
    enabled: true,
    version: '1.0.0',
  })

  return (
    <div
      key={`${address}-${tokenId}`}
      className='border border-mediumGrey rounded-[5px] overflow-hidden text-ellipsis whitespace-nowrap shadow-sm'
    >
      <Image
        src={getTokenURI({ contractDeployment, tokenId })}
        width={repository.width || 600}
        height={repository.height || 600}
        alt={`${address}-#${tokenId}`}
        className='object-cover m-auto'
      />
      <div className='space-y-1 pt-2 px-2'>
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
        {data?.owner && (
          <NextLinkComponent
            target='_blank'
            rel='noopener noreferrer'
            href={buildEtherscanLink({
              chainId,
              address: data.owner,
            })}
            underline
          >
            <div className='flex items-center space-x-2'>
              <AvatarComponent src='/images/avatar-blank.png' />
              <span className='text-xs'>{formatEthereumHash(data?.owner)}</span>
            </div>
          </NextLinkComponent>
        )}
      </div>
    </div>
  )
}
