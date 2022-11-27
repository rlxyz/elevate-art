// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  res.send({
    nextAuthUrl: process.env.VERCEL ? `https://${env.NEXTAUTH_URL}` : env.NEXTAUTH_URL,
    apiUrl: env.NEXT_PUBLIC_API_URL,
    appEnv: env.NEXT_PUBLIC_NODE_ENV,
  })
}

export default index
