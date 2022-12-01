import type { NextApiRequest, NextApiResponse } from 'next'
import { getContract, isAddress } from '../../../../utils/ethers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, id } = req.query as { address: string; id: string }
  if (!isAddress(address)) {
    return res.status(400).send({ error: 'Invalid address' })
  }

  const contract = getContract({ address })
  const tokenURI = await contract.tokenURI(id)
  const response = await fetch(tokenURI)
  const data = await response.json()
  if (response.status === 200) {
    return res.status(200).send({ attributes: data.attributes, name: data.name, image: data.image })
  }
  return res.status(400).send({ error: 'Invalid token id' })
}
