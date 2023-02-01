import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { v2 } from '@server/utils/cld-storage'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (!session || !session.user) {
    return res.status(401).send('Unauthorized')
  }

  const { r, l, t } = req.query as { r: string; l: string; t: string }
  if (!r || !l || !t) {
    return res.status(400).send('Bad Request')
  }

  const url = v2.url(`${env.NEXT_PUBLIC_NODE_ENV}/${r}/${l}/${t}.png`, {
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    secure: true,
    // transformation: IMAGE_QUALITY_SETTINGS,
    // version: version,
  })

  return res.redirect(301, url)
}

export default index
