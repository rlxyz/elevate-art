// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { NextApiRequest, NextApiResponse } from 'next'
import { clientEnv } from 'src/env/schema.mjs'

const getCldImgUrl = ({ r, l, t }: { r: string; l: string; t: string }) => {
  return `https://res.cloudinary.com/rlxyz/image/upload/c_scale,w_600/q_auto/v1/${clientEnv.NEXT_PUBLIC_NODE_ENV}/${r}/${l}/${t}.png`
}

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

  const data = await fetch(getCldImgUrl({ r, l, t }))
  if (data.status === 404) {
    return res.status(404).send('Not Found')
  }

  if (data.status === 200) {
    res.setHeader('Cache-Control', 'private, s-maxage=1, stale-while-revalidate=59')
    res.setHeader('Content-Type', 'image/png')
    return res.send(data.body)
  }
}

export default index
