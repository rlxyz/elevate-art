import { getTraitElementImage, getTraitElementInfo } from '@server/common/cld-get-image'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { Redis } from '@upstash/redis'
import { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
})

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

  const exist = await redis.get(`${env.NODE_ENV}/${r}/${l}/${t}`)
  if (exist) {
    const data = await fetch(getTraitElementImage({ r, l, t }))
    if (data.status === 404) {
      return res.status(404)
    }

    if (data.status === 200) {
      return res.send(data.body)
    }
  }

  const response = await getTraitElementInfo({ r, l, t })
  if (response.failed) {
    return res.status(404)
  }
  const { version, traitElementId } = response.getValue()

  try {
    const exist = await redis.get(traitElementId)
    if (!exist) {
      await redis.set(traitElementId, version)
    }
  } catch (error) {
    console.error(error)
  }

  const data = await fetch(getTraitElementImage({ r, l, t }))
  if (data.status === 404) {
    return res.status(404)
  }

  if (data.status === 200) {
    return res.send(data.body)
  }
}

export default index
