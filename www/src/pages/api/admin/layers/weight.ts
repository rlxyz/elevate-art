import { getLayerElementsWithTraitElementsTotalWeight } from '@server/common/get-all-layer-elements-total-weight-'
import { NextApiRequest, NextApiResponse } from 'next'

// @todo authenticate this
const index = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!prisma) return res.status(400)
  const response = await getLayerElementsWithTraitElementsTotalWeight({ prisma })
  return res.status(200).json(response)
}

export default index
