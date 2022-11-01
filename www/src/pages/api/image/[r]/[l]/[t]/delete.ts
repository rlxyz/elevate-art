import { deleteImageFromCloudinary } from '@server/common/cld-delete-image'
import { NextApiRequest, NextApiResponse } from 'next'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // r: repositoryId, l: layerElementId, t: traitElementId
  const { r, l, t } = req.query as { r: string; l: string; t: string }
  if (!r || !l || !t) {
    return res.status(400).send('Bad Request')
  }

  const data = await deleteImageFromCloudinary({
    r,
    l,
    t,
  })

  if (data.result === 'Error') {
    return res.status(400).send('Bad Request')
  }

  return res.status(200).send({ deleted: true })
}

export default index
