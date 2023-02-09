import type { AssetDeploymentType } from '@prisma/client'
import type { BigNumber } from 'ethers'

export type SaleConfig = {
  startTimestamp: Date
  mintPrice: BigNumber
  maxMintPerAddress: BigNumber
}

export type PayoutData = {
  estimatedPayout: BigNumber
  paymentReceiver: `0x${string}`
}

export type ContractInformationData = {
  name: string
  symbol: string
  owner: `0x${string}`
  mintType: AssetDeploymentType
  chainId: number
  collectionSize: BigNumber // is total mint possible in contract
}

//! @todo mirror the data types above...
export type RhapsodyContractData = {
  name: string
  symbol: string
  owner: `0x${string}`

  collectionSize: BigNumber
  totalSupply: BigNumber

  claimPeriod: SaleConfig
  presalePeriod: SaleConfig
  publicPeriod: SaleConfig
}

export type TokenMetadata = {
  name?: string | null | undefined
  description?: string | null | undefined
  tokenHash?: string | null | undefined
  attributes?: { trait_type: string | undefined; value: string | undefined }[] | undefined | null
  image?: string | null | undefined
  logoImage?: string | null | undefined
  bannerImage?: string | null | undefined
  artist?: string | null | undefined
  license?: string | null | undefined
  external_url?: string | null | undefined
}
