import type { BigNumber } from 'ethers'

export type SaleConfig = {
  startTimestamp: Date
  mintPrice: BigNumber
  maxAllocationPerAddress: BigNumber
}

export type PayoutData = {
  estimatedPayout: BigNumber
  paymentReceiver: `0x${string}`
}

export type ContractInformationData = {
  name: string
  symbol: string
  owner: `0x${string}`
  mintType: string
  chainId: number
  totalSupply: BigNumber // is current total mints in contract
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
