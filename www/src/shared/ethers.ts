import { AssetDeploymentType } from '@prisma/client'
import type { BigNumber } from 'ethers'
import { ethers } from 'ethers'
import { env } from 'src/env/client.mjs'
import basicContract from 'src/shared/contracts/RhapsodyCreatorBasic.json'
import generativeContract from 'src/shared/contracts/RhapsodyCreatorGenerative.json'

//! @todo add claimTime
export class ElevateContract extends ethers.Contract {
  readonly name!: () => Promise<string>
  readonly symbol!: () => Promise<string>
  readonly owner!: () => Promise<string>
  readonly mintPrice!: () => Promise<BigNumber>
  readonly maxPublicBatchPerAddress!: () => Promise<BigNumber>
  readonly totalSupply!: () => Promise<BigNumber>
  readonly collectionSize!: () => Promise<BigNumber>
  readonly presaleTime!: () => Promise<BigNumber>
  readonly publicTime!: () => Promise<BigNumber>
  readonly claimTime!: () => Promise<BigNumber>
  readonly tokenHash!: (tokenId: number) => Promise<string>
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
  const provider = new ethers.providers.AlchemyProvider(parseChainId(chainId), env.NEXT_PUBLIC_ALCHEMY_ID)
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
  return `https://${chainId === 1 ? '' : `${parseChainId(chainId)}.`}etherscan.io/address/${address}`
}
