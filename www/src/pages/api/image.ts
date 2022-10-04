// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { NextApiRequest, NextApiResponse } from 'next'

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (session) {
    const repositoryId = req.query.repositoryId as string
    const layerElementId = req.query.layerElementId as string
    const traitElementId = req.query.traitElementId as string
    console.log(repositoryId, traitElementId, layerElementId)
    // const data = await fetch(
    //   `https://res.cloudinary.com/rlxyz/image/upload/f_png/v1/${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${layerElementId}/${traitElementId}.png`
    // )
    // const newRes = new Response(data.body)
    // newRes.headers.set('Cache-Control', 'max-age=30, stale-while-revalidate')
    // return newRes
    res.send({ x: 1, r: repositoryId, t: traitElementId, l: layerElementId })
  } else {
    res.send({
      error: 'You must be signed in to view the protected content on this page.',
    })
  }
}

export default restricted
