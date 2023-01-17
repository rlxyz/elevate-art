import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { getAssetDeploymentBucket } from '@server/utils/gcp-storage'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'
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
type MetadataCacheInput = { repositoryId: string; deploymentId: string; id: string }
const metadataCacheObject = {
  get: async ({ repositoryId, deploymentId, id }: MetadataCacheInput) => {
    return await getAssetDeploymentBucket({ branch: AssetDeploymentBranch.PREVIEW })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ repositoryId, deploymentId, id, buffer }: MetadataCacheInput & { buffer: string | Buffer }) => {
    await getAssetDeploymentBucket({ branch: AssetDeploymentBranch.PREVIEW })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .save(buffer, { contentType: 'application/json' })
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
    const deployment = await prisma?.assetDeployment.findFirst({
      where: { repository: { name: repositoryName, organisation: { name: organisationName } }, name: seed },
    })

    if (!deployment) {
      return res.status(404).send('Not Found')
    }

    if (deployment.totalSupply <= parseInt(id)) {
      return res.status(400).send('Bad Request')
    }

    const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

    const tokens = v.one(v.parseLayer(layerElements), v.seed(deployment.repositoryId, deployment.slug, deployment.generations, id))

    const response = {
      image: `${env.NEXT_PUBLIC_API_URL}/assets/${organisationName}/${repositoryName}/${seed}/${id}/image`,
      attributes: tokens.reverse().map(([l, t]) => {
        const layerElement = layerElements.find((x) => x.id === l)
        if (!layerElement) return
        const traitElement = layerElement.traits.find((x) => x.id === t)
        if (!traitElement) return

        return {
          trait_type: layerElement.name,
          value: traitElement.name,
        }
      }),
    }

    // await metadataCacheObject.put({
    //   repositoryId: deployment.repositoryId,
    //   deploymentId: deployment.id,
    //   id,
    //   buffer: JSON.stringify(response),
    // })

    return res.setHeader('Content-Type', 'application/json').send(JSON.stringify(response, null, 2))
  } catch (err) {
    console.error(err)
    return res.status(503).send('Internal Server Error')
  }
}

export default index
