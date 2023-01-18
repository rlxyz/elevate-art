import { getServerAuthSession } from '@server/common/get-server-auth-session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { log } from 'next-axiom'
import { formatBytes } from 'src/client/utils/format'
import { env } from 'src/env/server.mjs'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  log.debug(`new health check request`, { user: session?.user?.id || 'anonymous' })
  return res.status(200).send({
    nextAuthUrl: env.NEXTAUTH_URL,
    apiUrl: env.NEXT_PUBLIC_API_URL,
    assetUrl: env.NEXT_PUBLIC_ASSET_URL,
    nodeEnv: env.NODE_ENV,
    nextPublicNodeEnv: env.NEXT_PUBLIC_NODE_ENV,
    maxImageBytesAllowed: formatBytes(env.NEXT_PUBLIC_IMAGE_MAX_BYTES_ALLOWED),
  })
}

export default index
