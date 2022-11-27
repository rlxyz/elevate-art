// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { NextApiRequest, NextApiResponse } from 'next'
import { log } from 'next-axiom'
import { env } from 'src/env/server.mjs'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  log.debug(`new health check request`, { user: session?.user?.id || 'anonymous' })
  return res.status(200).send({
    nextAuthUrl: env.NEXTAUTH_URL ? env.NEXTAUTH_URL : process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    apiUrl: env.NEXT_PUBLIC_API_URL,
    appEnv: env.NEXT_PUBLIC_NODE_ENV,
  })
}

export default index
