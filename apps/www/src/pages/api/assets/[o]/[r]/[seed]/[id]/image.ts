import type { Image } from '@napi-rs/canvas'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getTraitElementImageFromGCP } from '@server/common/gcp-get-image'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { getAssetDeploymentBucket } from '@server/utils/gcp-storage'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as v from 'src/shared/compiler'
import { prisma } from '../../../../../../../server/db/client'

/**
 * Note, this is a cache built around the compiler functionality to ensure that
 * we only need to compile a single token id once per deployment.
 *
 * That is, if a token has 12 LayerElements === 12 TraitElements, then we only need
 * to fetch from the GCP bucket once per token id.
 *
 * And during the compilation of images using skia-constructor, we re-upload the new compiled token image
 * to the GCP bucket.
 *
 * @todo in "put", save the metadata of the attributes names... so that we can use that to infer the metadata instead of needing a second query to metadata
 */
type ImageCacheInput = { repositoryId: string; deploymentId: string; id: string }
const imageCacheObject = {
  get: async ({ repositoryId, deploymentId, id }: ImageCacheInput) => {
    return await getAssetDeploymentBucket({ branch: AssetDeploymentBranch.PREVIEW })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/image.png`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ repositoryId, deploymentId, id, buffer }: ImageCacheInput & { buffer: Buffer }) => {
    await getAssetDeploymentBucket({ branch: AssetDeploymentBranch.PREVIEW })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/image.png`)
      .save(buffer, { contentType: 'image/png' })
  },
}

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

  try {
    // get the repository with repositoryId's layerElement, traitElements & rules with prisma
    const deployment = await prisma.assetDeployment.findFirst({
      where: { repository: { name: repositoryName, organisation: { name: organisationName } }, name: seed },
    })

    if (!deployment) {
      return res.status(404).send('Not Found')
    }

    if (deployment.totalSupply <= parseInt(id)) {
      return res.status(400).send('Bad Request')
    }

    const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

    const tokens = v.one(
      v.parseLayer(layerElements.sort((a, b) => a.priority - b.priority)),
      v.seed(deployment.repositoryId, deployment.slug, deployment.generations, id)
    )

    const canvas = createCanvas(600, 600)
    const ctx = canvas.getContext('2d')

    const response = await Promise.all(
      tokens.map(([l, t]) => {
        return new Promise<Image>(async (resolve, reject) => {
          const response = await getTraitElementImageFromGCP({
            r: deployment.repositoryId,
            d: deployment.id,
            l,
            t,
            branch: deployment.branch,
          })
          if (response.failed) return reject()
          const buffer = response.getValue()
          if (!buffer) return reject()
          return resolve(await loadImage(buffer))
        })
      })
    )

    response.forEach((image) => {
      ctx.drawImage(image, 0, 0, 600, 600)
    })

    const buf = canvas.toBuffer('image/png')

    return res.setHeader('Content-Type', 'image/png').send(buf)
  } catch (e) {
    return res.status(500).send('Internal Server Error')
  }
}

export default index
