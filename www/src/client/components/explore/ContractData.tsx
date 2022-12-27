import type { BigNumber } from 'ethers'

// @todo find somewhere to put this

export type ContractData = {
  projectOwner: string
  mintPrice: BigNumber
  maxAllocationPerAddress: BigNumber
  totalSupply: BigNumber
  publicTime: Date
  presaleTime: Date
}
