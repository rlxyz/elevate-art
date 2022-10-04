// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { NextApiRequest, NextApiResponse } from 'next'
import { clientEnv } from 'src/env/schema.mjs'

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (session) {
    const repositoryId = req.query.r as string
    const layerElementId = req.query.l as string
    const traitElementId = req.query.t as string
    if (repositoryId && layerElementId && traitElementId) {
      const data = await fetch(
        `https://res.cloudinary.com/rlxyz/image/upload/f_png/v1/${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${layerElementId}/${traitElementId}.png`
      )
      res.setHeader('Cache-Control', 'private, max-age=30, stale-while-revalidate')
      res.setHeader('Content-Type', 'image/png')
      return res.send(data.body)
    }
  }
  return res.send({
    error: 'You must be signed in to view the protected content on this page.',
  })
}

export default restricted
