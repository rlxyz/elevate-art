import type { BigNumber } from 'ethers'

export type RhapsodyContractData = {
  projectOwner: string
  collectionSize: BigNumber
  totalSupply: BigNumber
  claimPeriod: {
    startTimestamp: Date
    mintPrice: BigNumber
    maxAllocationPerAddress: BigNumber
  }
  presalePeriod: {
    startTimestamp: Date
    mintPrice: BigNumber
    maxAllocationPerAddress: BigNumber
  }
  publicPeriod: {
    startTimestamp: Date
    mintPrice: BigNumber
    maxAllocationPerAddress: BigNumber
  }
}
