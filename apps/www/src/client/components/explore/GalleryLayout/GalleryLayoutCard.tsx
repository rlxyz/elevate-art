import AvatarComponent from '@components/layout/avatar/Avatar'
import LinkComponent from '@components/layout/link/Link'
import NextLinkComponent from '@components/layout/link/NextLink'
import type { AssetDeploymentBranch, ContractDeployment } from '@prisma/client'
import { buildEtherscanLink, formatEthereumHash } from '@utils/ethers'
import { getDeploymentTokenMetadata, getTokenURI } from 'src/client/utils/image'
import { useFetchContractTokenData } from '../SaleLayout/useFetchContractData'

export const GalleryLayoutCard = ({
  contractDeployment,
  deploymentName,
  branch,
  repositoryName,
  organisationName,
  tokenId,
  tokenName,
}: {
  contractDeployment: ContractDeployment
  deploymentName: string
  branch: AssetDeploymentBranch
  organisationName: string
  repositoryName: string
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
      <img
        src={getTokenURI({ contractDeployment, tokenId })}
        width={1000}
        height={1000}
        alt={`${address}-#${tokenId}`}
        className='object-cover m-auto'
      />
      <div className='space-y-1 pt-2 px-2'>
        <h1 className='text-xs font-semibold'>
          <LinkComponent
            target='_blank'
            rel='noopener noreferrer'
            href={getDeploymentTokenMetadata({
              o: organisationName,
              r: repositoryName,
              tokenId: tokenId,
              d: deploymentName,
              branch: branch,
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
