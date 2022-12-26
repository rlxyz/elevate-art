import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getAssetDeploymentBucket, getTraitElementImageFromGCP, imageCacheObject } from '@server/utils/gcp-storage'
import type { Image } from 'canvas-constructor/skia'
import { Canvas, resolveImage } from 'canvas-constructor/skia'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // o: organisationName, r: repositoryName, seed, id
  const { o: organisationName, r: repositoryName, seed, id } = req.query as { o: string; r: string; seed: string; id: string }
  if (!organisationName || !repositoryName || !seed || !id) {
    return res.status(400).send('Bad Request')
  }

  // get the repository with repositoryId's layerElement, traitElements & rules with prisma
  const deployment = await prisma?.assetDeployment.findFirst({
    where: {
      branch: AssetDeploymentBranch.PREVIEW,
      repository: { name: repositoryName, organisation: { name: organisationName } },
      name: seed,
    },
  })

  if (!deployment) {
    return res.status(404).send('Not Found')
  }

  if (deployment.totalSupply <= parseInt(id)) {
    return res.status(400).send('Bad Request')
  }

  // look into cache whether image exist
  const image = await imageCacheObject.get({
    type: AssetDeploymentBranch.PREVIEW,
    repositoryId: deployment.repositoryId,
    deploymentId: deployment.id,
    id,
  })

  const [url] = await getAssetDeploymentBucket({
    type: AssetDeploymentBranch.PREVIEW,
  })
    .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${id}/image.png`)
    .getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    })

  if (image) {
    return res.setHeader('Cache-Control', 'public, max-age=31536000, immutable').redirect(308, url)
  }

  const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

  const tokens = v.one(v.parseLayer(layerElements), v.seed(deployment.repositoryId, deployment.slug, deployment.generations, id))

  const canvas = new Canvas(600, 600)

  const response = await Promise.all(
    tokens.reverse().map(([l, t]) => {
      return new Promise<Image>(async (resolve, reject) => {
        const response = await getTraitElementImageFromGCP({
          type: AssetDeploymentBranch.PREVIEW,
          r: deployment.repositoryId,
          d: deployment.id,
          l,
          t,
        })
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
  await imageCacheObject.put({
    type: AssetDeploymentBranch.PREVIEW,
    repositoryId: deployment.repositoryId,
    deploymentId: deployment.id,
    id,
    buffer: buf,
  })

  return res.setHeader('Cache-Control', 'public, max-age=31536000, immutable').redirect(308, url)
}

export default index
