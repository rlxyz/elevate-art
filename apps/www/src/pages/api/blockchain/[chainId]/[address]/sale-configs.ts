import { getClaimTime } from '@server/common/ethers-get-contract-claim-time'
import { getMaxAllocationPerAddress } from '@server/common/ethers-get-contract-max-allocation-per-address'
import { getMintPrice } from '@server/common/ethers-get-contract-mint-price'
import { getPresaleTime } from '@server/common/ethers-get-contract-presale-time'
import { getPublicTime } from '@server/common/ethers-get-contract-public-time'
import type { SaleConfig } from '@utils/contracts/ContractData'
import { BigNumber } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chainId, address: address } = req.query as unknown as {
    chainId: number
    address: string
  }

  const saleConfig: SaleConfig[] = [
    {
      startTimestamp: (await getClaimTime(address, chainId)).getValue(),
      mintPrice: BigNumber.from(0),
      maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
    },
    {
      startTimestamp: (await getPresaleTime(address, chainId)).getValue(),
      mintPrice: (await getMintPrice(address, chainId)).getValue(),
      maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
    },
    {
      startTimestamp: (await getPublicTime(address, chainId)).getValue(),
      mintPrice: (await getMintPrice(address, chainId)).getValue(),
      maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
    },
  ]

  return res.setHeader('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=59').json(saleConfig)
}

export default handler
