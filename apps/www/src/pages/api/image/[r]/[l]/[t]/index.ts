import { getTraitElementImage } from '@server/common/cld-get-image'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { Redis } from '@upstash/redis'
import { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (!session || !session.user) {
    return res.status(401).send('Unauthorized')
  }

  // r: repositoryId, l: layerElementId, t: traitElementId
  const { r, l, t } = req.query as { r: string; l: string; t: string }
  if (!r || !l || !t) {
    return res.status(400).send('Bad Request')
  }
  // const response = await getTraitElementInfo({ r, l, t })
  // if (response.failed) {
  //   return res.status(400).send('Bad Request')
  // }
  // const { version, traitElementId } = response.getValue()

  getTraitElementImage({ r, l, t })
    .then((response) => {
      return res.setHeader('Content-Type', 'image/png').status(200).send(response.getValue())
    })
    .catch((err) => {
      return res.status(500).send(err)
    })

  return res.status(504)
}

export default index
