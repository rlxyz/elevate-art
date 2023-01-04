import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch, AssetDeploymentType } from '@prisma/client'
import { getTokenHash } from '@server/common/ethers-get-contract-token-hash'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { getAssetDeploymentBucket, metadataCacheObject } from '@server/utils/gcp-storage'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'
import * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // o: organisationName, r: repositoryName, seed, id
  const { o: organisationName, r: repositoryName, id } = req.query as { o: string; r: string; id: string }
  if (!organisationName || !repositoryName || !id) {
    return res.status(404).send('Not Found')
  }

  // get the repository with repositoryId's layerElement, traitElements & rules with prisma
  const deployment = await prisma?.assetDeployment.findFirst({
    where: {
      repository: { name: repositoryName, organisation: { name: organisationName } },
      branch: AssetDeploymentBranch.PRODUCTION,
    },
    include: { repository: true, contractDeployment: true },
  })

  if (!deployment || !deployment.contractDeployment) {
    return res.status(404).send('Not Found')
  }

  if (deployment.totalSupply <= parseInt(id)) {
    return res.status(404).send('Not Found')
  }

  const { contractDeployment } = deployment

  // check contract if token exists
  const currentTotalSupply = (await getTotalSupply(contractDeployment.address, contractDeployment.chainId)).getValue()
  if (currentTotalSupply.lt(id)) {
    return res.status(404).send('Not Found')
  }

  // look into cache whether image exist
  const metadata = await metadataCacheObject.get({
    branch: AssetDeploymentBranch.PRODUCTION,
    repositoryId: deployment.repositoryId,
    deploymentId: deployment.id,
    id,
  })

  const [url] = await getAssetDeploymentBucket({
    branch: AssetDeploymentBranch.PREVIEW,
  })
    .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${id}/metadata.json`)
    .getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    })

  if (metadata) {
    return res.setHeader('Cache-Control', 'public, max-age=31536000, immutable').redirect(308, url)
  }

  const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

  // get the seed from the contract if generative type
  //! @todo test t
  const { type } = deployment
  let seed = v.seed(deployment.repositoryId, deployment.slug, deployment.generations, id)
  if (type === AssetDeploymentType.GENERATIVE) {
    const tokenHashResponse = await getTokenHash(contractDeployment.address, contractDeployment.chainId, Number(id))
    if (tokenHashResponse.failed) {
      return res.status(404).send('Not Found')
    }
    const tokenHash = tokenHashResponse.getValue()
    if (!tokenHash) {
      return res.status(404).send('Not Found')
    }
    seed = tokenHash
  }

  const tokens = v.one(v.parseLayer(layerElements), seed)
  const response = {
    name: `${deployment.repository.tokenName} #${id}`,
    image: `${env.NEXT_PUBLIC_API_URL}/assets/${organisationName}/${repositoryName}/${id}/image`,
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
    branch: AssetDeploymentBranch.PRODUCTION,
    repositoryId: deployment.repositoryId,
    deploymentId: deployment.id,
    id,
    buffer: JSON.stringify(response),
  })

  return res.setHeader('Cache-Control', 'public, max-age=31536000, immutable').send(JSON.stringify(response, null, 2))
}

export default index
