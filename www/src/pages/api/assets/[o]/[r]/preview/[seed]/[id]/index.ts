<<<<<<< HEAD:www/src/pages/api/assets/[o]/[r]/preview/[seed]/[id]/index.ts
import type { Prisma } from '@prisma/client'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { metadataCacheObject } from '@server/utils/gcp-bucket-actions'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'
import * as v from 'src/shared/compiler'

=======
import { AssetDeploymentBranch, Prisma } from '@prisma/client'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { getAssetDeploymentBucket } from '@server/utils/gcp-storage'
import { NextApiRequest, NextApiResponse } from 'next'
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
    return await getAssetDeploymentBucket({ type: AssetDeploymentBranch.PREVIEW })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ repositoryId, deploymentId, id, buffer }: MetadataCacheInput & { buffer: string | Buffer }) => {
    await getAssetDeploymentBucket({ type: AssetDeploymentBranch.PREVIEW })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .save(buffer, { contentType: 'application/json' })
  },
}

>>>>>>> jp/asset-query-seed-cache-layer:www/src/pages/api/assets/[o]/[r]/[seed]/[id]/metadata.ts
const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (!session || !session.user) {
    return res.status(401).send('Unauthorized')
  }

  // o: organisationName, r: repositoryName, seed, id
  const { o: organisationName, r: repositoryName, seed, id } = req.query as { o: string; r: string; seed: string; id: string }
  if (!organisationName || !repositoryName || !seed || !id) {
    return res.status(400).send('Bad Request')
  }

  // get the repository with repositoryId's layerElement, traitElements & rules with prisma
  //! only users who are members of the organisation can access the image through stealth mode
  const deployment = await prisma?.assetDeployment.findFirst({
    where: {
      repository: { name: repositoryName, organisation: { name: organisationName, members: { some: { userId: session.user.id } } } },
      name: seed,
    },
    include: { repository: true },
  })

  if (!deployment) {
    return res.status(404).send('Not Found')
  }

  if (deployment.totalSupply <= parseInt(id)) {
    return res.status(400).send('Bad Request')
  }

  // look into cache whether image exist
  const metadata = await metadataCacheObject.get({ repositoryId: deployment.repositoryId, deploymentId: deployment.id, id })
  if (metadata) return res.setHeader('Content-Type', 'application/json').status(200).send(metadata)

  const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

  const tokens = v.one(v.parseLayer(layerElements), v.seed(deployment.repositoryId, deployment.slug, deployment.generations, id))

  const response = {
    name: `${deployment.repository.tokenName} #${id}`,
    image: `${env.NEXT_PUBLIC_API_URL}/asset/${organisationName}/${repositoryName}/preview/${seed}/${id}/image`,
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

  await metadataCacheObject.put({
    repositoryId: deployment.repositoryId,
    deploymentId: deployment.id,
    id,
    buffer: JSON.stringify(response),
  })

  return res.setHeader('Content-Type', 'application/json').send(JSON.stringify(response, null, 2))
}

export default index
