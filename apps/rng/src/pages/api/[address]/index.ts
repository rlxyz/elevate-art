// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { findContractData, ingestBulkContractData } from '../../../server/elastric-search'
import { getContract, isAddress } from '../../../utils/ethers'

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
  // if (data.length === 0) {
  const contract = getContract({ address })
  const tokenURI = (await contract.tokenURI(0)) as string
  const baseURI = tokenURI.substring(0, tokenURI.lastIndexOf('0'))

  let allTokens: { id: number; attributes: { trait_type: string; value: string }; name: string; image: string }[] = []
  await Promise.all(
    Array.from(Array(2).keys()).map(async (id) => {
      const response = await fetch(`${baseURI}${id}`)
      // @todo error handle
      const data = await response.json()
      allTokens.push({ id, attributes: data.attributes, name: `#${id}`, image: data.image })
    })
  )

  // @todo error handle
  const response = await ingestBulkContractData({
    address,
    data: allTokens,
  })

  // return the data
  res.status(200).json({ address, uploaded })
}
