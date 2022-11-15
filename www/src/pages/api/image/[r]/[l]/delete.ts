import { deleteImageFolderFromCloudinary } from '@server/scripts/cld-delete-image'
import { NextApiRequest, NextApiResponse } from 'next'

// @todo authenticated?
const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // r: repositoryId, l: layerElementId
  const { r, l } = req.query as { r: string; l: string }
  if (!r || !l) {
    return res.status(400).send('Bad Request')
  }

  const data = await deleteImageFolderFromCloudinary({
    r,
    l,
  })

  if (data.result === 'Error') {
    return res.status(400).send('Bad Request')
  }

  return res.status(200).send({ deleted: true })
}

export default index
