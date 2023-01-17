import { getTraitElementImage } from '@server/common/cld-get-image'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import type { NextApiRequest, NextApiResponse } from 'next'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (!session || !session.user) {
    return res.status(401).send('Unauthorized')
  }

  const { r, l, t } = req.query as { r: string; l: string; t: string }
  if (!r || !l || !t) {
    return res.status(400).send('Bad Request')
  }

  getTraitElementImage({ r, l, t })
    .then(async (response) => {
      const buffer = response.getValue()
      if (!buffer) return
      return res.setHeader('Content-Type', 'image/png').status(200).send(buffer)
    })
    .catch((err) => {
      return res.status(500).send(err)
    })

  return res.status(504)
}

export default index
