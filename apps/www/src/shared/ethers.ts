import { AssetDeploymentType } from '@prisma/client'
import type { BigNumber } from 'ethers'
import { ethers } from 'ethers'
import basicContract from 'src/shared/contracts/RhapsodyCreatorBasic.json'
import generativeContract from 'src/shared/contracts/RhapsodyCreatorGenerative.json'
import { getRandomAlchemyKey } from './alchemy'

export class ElevateContract extends ethers.Contract {
  readonly name!: () => Promise<string>
  readonly symbol!: () => Promise<string>
  readonly owner!: () => Promise<string>
  readonly mintPrice!: () => Promise<BigNumber>
  readonly maxMintPerAddress!: () => Promise<BigNumber>
  readonly totalSupply!: () => Promise<BigNumber>
  readonly collectionSize!: () => Promise<BigNumber>
  readonly presaleTime!: () => Promise<BigNumber>
  readonly publicTime!: () => Promise<BigNumber>
  readonly claimTime!: () => Promise<BigNumber>
  readonly tokenHash!: (tokenId: number) => Promise<string>
  readonly ownerOf!: (tokenId: number) => Promise<string>
}

export const parseChainId = (chainId: number): 'mainnet' | 'goerli' | 'unknown' => {
  switch (chainId) {
    case 1:
      return 'mainnet'
    case 5:
      return 'goerli'
    default:
      return 'unknown'
  }
}

export const parseChainIdCurrency = (chainId: number): 'ETH' | 'GoerliETH' | 'unknown' => {
  switch (chainId) {
    case 1:
      return 'ETH'
    case 5:
      return 'GoerliETH'
    default:
      return 'unknown'
  }
}

export const getElevateContract = ({
  address,
  chainId,
  type = AssetDeploymentType.BASIC,
}: {
  address: string
  chainId: number
  type?: AssetDeploymentType
}): ElevateContract => {
  const provider = new ethers.providers.AlchemyProvider(parseChainId(Number(chainId)), getRandomAlchemyKey())
  const contract = new ElevateContract(
    address,
    type === AssetDeploymentType.BASIC
      ? basicContract.abi
      : type === AssetDeploymentType.GENERATIVE
      ? generativeContract.abi
      : basicContract.abi,
    provider
  )
  return contract
}

export const buildEtherscanLink = ({ address, chainId }: { address: string; chainId: number }) => {
  return `https://${chainId === 1 ? '' : `${parseChainId(Number(chainId))}.`}etherscan.io/address/${address}`
}

export const formatEthereumHash = (hash: string) => {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

/// contract versioning: v1.0.0
export const getMintRandomizerContract = ({ chainId }: { chainId: number }) => {
  if (chainId === 5) {
    return '0x41a1F0aEBfCD87E7a6B546F44d5D092d69102F75'
  }

  if (chainId === 1) {
    return '0x03e77F58EaAa3Aac4e62acD6425b348cfcc10002'
  }

  throw new Error('Unsupported chainId')
}
