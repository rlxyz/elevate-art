<<<<<<< HEAD:apps/www/src/pages/api/image/[r]/[l]/[t]/index.ts
// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { getServerAuthSession } from '@elevateart/api'
=======
import { getTraitElementImage } from '@server/common/cld-get-image'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { Redis } from '@upstash/redis'
>>>>>>> staging:www/src/pages/api/image/[r]/[l]/[t]/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'

<<<<<<< HEAD:apps/www/src/pages/api/image/[r]/[l]/[t]/index.ts
// @todo this shoudl be a function in the api package & also use env variables for res.cloudinary.com/rlxyz
const getCldImgUrl = ({ r, l, t }: { r: string; l: string; t: string }) => {
  return `https://res.cloudinary.com/rlxyz/image/upload/c_scale,w_600/q_auto/v1/${clientEnv.NEXT_PUBLIC_NODE_ENV}/${r}/${l}/${t}.png`
=======
export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
})

export const config = {
  api: {
    responseLimit: '8mb',
    externalResolver: true,
  },
>>>>>>> staging:www/src/pages/api/image/[r]/[l]/[t]/index.ts
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
