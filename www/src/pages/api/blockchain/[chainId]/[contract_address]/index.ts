// write a vercel api handler that returns the contract data
//
// https://vercel.com/docs/serverless-functions/introduction

import { getClaimTime } from '@server/common/ethers-get-contract-claim-time'
import { getCollectionSize } from '@server/common/ethers-get-contract-collection-size'
import { getMaxAllocationPerAddress } from '@server/common/ethers-get-contract-max-allocation-per-address'
import { getMintPrice } from '@server/common/ethers-get-contract-mint-price'
import { getContractOwner } from '@server/common/ethers-get-contract-owner'
import { getPresaleTime } from '@server/common/ethers-get-contract-presale-time'
import { getPublicTime } from '@server/common/ethers-get-contract-public-time'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import type { RhapsodyContractData } from '@utils/contracts/ContractData'
import { BigNumber } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chainId, contract_address: address } = req.query as unknown as {
    chainId: number
    contract_address: string
  }

  const contract = {
    projectOwner: (await getContractOwner(address, chainId)).getValue(),
    totalSupply: (await getTotalSupply(address, chainId)).getValue(), // @todo remove this
    collectionSize: (await getCollectionSize(address, chainId)).getValue(),
    claimPeriod: {
      startTimestamp: (await getClaimTime(address, chainId)).getValue(),
      mintPrice: BigNumber.from(0),
      maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
    },
    presalePeriod: {
      startTimestamp: (await getPresaleTime(address, chainId)).getValue(),
      mintPrice: (await getMintPrice(address, chainId)).getValue(),
      maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
    },
    publicPeriod: {
      startTimestamp: (await getPublicTime(address, chainId)).getValue(),
      mintPrice: (await getMintPrice(address, chainId)).getValue(),
      maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
    },
  } as RhapsodyContractData

  return res.setHeader('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=59').json(contract)
}
