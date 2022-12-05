import { Prisma } from '@prisma/client'
import { getTraitElementImage } from '@server/common/cld-get-image'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { Canvas, Image, resolveImage } from 'canvas-constructor/skia'
import { NextApiRequest, NextApiResponse } from 'next'
import * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (!session || !session.user) {
    return res.status(401).send('Unauthorized')
  }

  // r: repositoryId, l: layerElementId, t: traitElementId
  const { o: organisationName, r: repositoryName, seed, id } = req.query as { o: string; r: string; seed: string; id: string }
  if (!organisationName || !repositoryName || !seed || !id) {
    return res.status(400).send('Bad Request')
  }

  // get the repository with repositoryId's layerElement, traitElements & rules with prisma
  const deployment = await prisma?.repositoryDeployment.findFirst({
    where: { repository: { name: repositoryName, organisation: { name: organisationName } }, name: seed },
  })

  if (!deployment) {
    return res.status(404).send('Not Found')
  }

  const layerElements = deployment.attributes as Prisma.JsonArray as v.Layer[]

  const tokens = v.one(
    v.parseLayer(layerElements),
    v.seed(deployment.repositoryId, deployment.collectionName, deployment.collectionGenerations, id)
  )

  const canvas = new Canvas(600, 600)

  const response = await Promise.all(
    tokens.reverse().map(([l, t]) => {
      return new Promise<Image>(async (resolve, reject) => {
        const response = await getTraitElementImage({ r: deployment.repositoryId, l, t })
        if (response.failed) return reject()
        const blob = response.getValue()
        if (!blob) return reject()
        const buffer = Buffer.from(await blob.arrayBuffer())
        return resolve(await resolveImage(buffer))
      })
    })
  )

  response.forEach((image, i) => {
    canvas.printImage(image, 0, 0, 600, 600)
  })

  const buf = canvas.toBuffer('image/png')
  return res.setHeader('Content-Type', 'image/png').send(buf)
}

export default index
