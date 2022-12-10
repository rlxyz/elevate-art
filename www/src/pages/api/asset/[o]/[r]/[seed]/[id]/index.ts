import type { Prisma } from '@prisma/client'
import { getTraitElementImageFromGCP } from '@server/common/gcp-get-image'
import { storage } from '@server/utils/gcp-storage'
import type { Image } from 'canvas-constructor/skia'
import { Canvas, resolveImage } from 'canvas-constructor/skia'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as v from 'src/shared/compiler'

/**
 * Note, this is a cache built around the compiler functionality to ensure that
 * we only need to compile a single token id once per deployment.
 *
 * That is, if a token has 12 LayerElements === 12 TraitElements, then we only need
 * to fetch from the GCP bucket once per token id.
 *
 * And during the compilation of images using skia-constructor, we re-upload the new compiled token image
 * to the GCP bucket.
 */
type ImageCacheInput = { repositoryId: string; deploymentId: string; id: string }
const imageCacheObject = {
  get: async ({ repositoryId, deploymentId, id }: ImageCacheInput) => {
    return await storage
      .bucket(`elevate-${repositoryId}-assets`)
      .file(`deployments/${deploymentId}/tokens/${id}/image.png`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ repositoryId, deploymentId, id, buffer }: ImageCacheInput & { buffer: Buffer }) => {
    await storage
      .bucket(`elevate-${repositoryId}-assets`)
      .file(`deployments/${deploymentId}/tokens/${id}/image.png`)
      .save(buffer, { contentType: 'image/png' })
  },
}

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await getServerAuthSession({ req, res })
  // if (!session || !session.user) {
  //   return res.status(401).send('Unauthorized')
  // }

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

  if (deployment.collectionTotalSupply <= parseInt(id)) {
    return res.status(400).send('Bad Request')
  }

  // look into cache whether image exist
  const image = await imageCacheObject.get({ repositoryId: deployment.repositoryId, deploymentId: deployment.id, id })
  if (image) return res.setHeader('Content-Type', 'image/png').status(200).send(image)

  const layerElements = deployment.attributes as Prisma.JsonArray as v.Layer[]

  const tokens = v.one(
    v.parseLayer(layerElements),
    v.seed(deployment.repositoryId, deployment.collectionName, deployment.collectionGenerations, id)
  )

  const canvas = new Canvas(600, 600)

  const response = await Promise.all(
    tokens.reverse().map(([l, t]) => {
      return new Promise<Image>(async (resolve, reject) => {
        const response = await getTraitElementImageFromGCP({ r: deployment.repositoryId, d: deployment.id, l, t })
        if (response.failed) return reject()
        const buffer = response.getValue()
        if (!buffer) return reject()
        return resolve(await resolveImage(buffer))
      })
    })
  )

  response.forEach((image) => {
    canvas.printImage(image, 0, 0, 600, 600)
  })

  const buf = canvas.toBuffer('image/png')
  await imageCacheObject.put({ repositoryId: deployment.repositoryId, deploymentId: deployment.id, id, buffer: buf })

  return res.setHeader('Content-Type', 'image/png').send(buf)
}

export default index
