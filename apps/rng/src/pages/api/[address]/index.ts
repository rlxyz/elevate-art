// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ingestContractData from '../../../server/elastric-search'
import { isAddress } from '../../../utils/ethers'

type Data =
  | {
      address: string
      uploaded: string
    }
  | { error: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!isAddress(req.query.address as string)) {
    return res.status(400).send({ error: 'Invalid address' })
  }

  const response = await ingestContractData({ address: req.body.params })
  res.status(200).json({ address: req.body.params, uploaded: response.result.toString() })
}
