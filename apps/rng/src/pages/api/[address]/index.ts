// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ingestContractData, { findContractData } from '../../../server/elastric-search'
import { isAddress } from '../../../utils/ethers'

type Data =
  | {
      address: string
      uploaded: boolean
    }
  | { error: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { address } = req.query as { address: string }

  // error if the address is not valid
  if (!isAddress(address)) {
    return res.status(400).send({ error: 'Invalid address' })
  }

  // search data from elastic
  const data = await findContractData({
    address,
  })

  // upload if not found
  let uploaded = false
  if (data.length === 0) {
    // @todo error handle
    const response = await ingestContractData({ address })
    uploaded = true
  }

  // return the data
  res.status(200).json({ address, uploaded })
}
