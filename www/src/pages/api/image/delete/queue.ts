import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { Client } from '@upstash/qstash'
import { NextApiRequest, NextApiResponse } from 'next'
import { clientEnv } from 'src/env/schema.mjs'
import { env } from 'src/env/server.mjs'

const c = new Client({
  token: env.QSTASH_TOKEN,
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

  const { messageId } = await c.publishJSON({
    url: `${clientEnv.NEXT_PUBLIC_API_URL}/image/${r}/${l}/${t}/delete`,
    body: {
      hello: 'world',
    },
  })

  return res.status(200).send({ messageId })
}

export default index
