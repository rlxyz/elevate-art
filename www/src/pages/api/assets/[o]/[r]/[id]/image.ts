import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch, AssetDeploymentType } from '@prisma/client'
import { getTokenHash } from '@server/common/ethers-get-contract-token-hash'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { getAssetDeploymentBucket, getTraitElementImageFromGCP, imageCacheObject } from '@server/utils/gcp-storage'
import type { Image } from 'canvas-constructor/skia'
import { Canvas, resolveImage } from 'canvas-constructor/skia'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // o: organisationName, r: repositoryName, seed, id
  const { o: organisationName, r: repositoryName, id } = req.query as { o: string; r: string; id: string }
  if (!organisationName || !repositoryName || !id) {
    return res.status(400).send('Bad Request')
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
    return res.status(400).send('Bad Request')
  }

  const { contractDeployment } = deployment

  // check contract if token exists
  const currentTotalSupply = (await getTotalSupply(contractDeployment.address, contractDeployment.chainId)).getValue()
  if (currentTotalSupply.lt(id)) {
    return res.status(400).send('Bad Request')
  }

  // look into cache whether image exist
  const image = await imageCacheObject.get({
    type: AssetDeploymentBranch.PRODUCTION,
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

  // get the seed from the contract if generative type
  //! @todo test this
  const { type } = deployment
  let seed = v.seed(deployment.repositoryId, deployment.slug, deployment.generations, id)
  if (type === AssetDeploymentType.GENERATIVE) {
    const tokenHashResponse = await getTokenHash(contractDeployment.address, contractDeployment.chainId, Number(id))
    if (tokenHashResponse.failed) {
      return res.status(500).send('Internal Server Error')
    }
    const tokenHash = tokenHashResponse.getValue()
    if (!tokenHash) {
      return res.status(500).send('Internal Server Error')
    }
    seed = tokenHash
  }

  const tokens = v.one(v.parseLayer(layerElements), seed)
  const canvas = new Canvas(600, 600)
  const response = await Promise.all(
    tokens.reverse().map(([l, t]) => {
      return new Promise<Image>(async (resolve, reject) => {
        const response = await getTraitElementImageFromGCP({
          type: AssetDeploymentBranch.PRODUCTION,
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
    type: AssetDeploymentBranch.PRODUCTION,
    repositoryId: deployment.repositoryId,
    deploymentId: deployment.id,
    id,
    buffer: buf,
  })

  return res.setHeader('Cache-Control', 'public, max-age=31536000, immutable').redirect(308, url)
}

export default index
