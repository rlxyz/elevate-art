import type { PayoutData } from '@utils/contracts/ContractData'
import { BigNumber } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { chainId, address: address } = req.query as unknown as {
    chainId: number
    address: string
  }

  const payoutData: PayoutData = {
    estimatedPayout: BigNumber.from(0),
    paymentReceiver: '0x',
  }

  return res.setHeader('Cache-Control', 'public, s-maxage=2, stale-while-revalidate=59').json(payoutData)
}

export default handler
