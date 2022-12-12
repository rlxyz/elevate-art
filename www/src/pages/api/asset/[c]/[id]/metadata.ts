import type { Prisma } from '@prisma/client'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { storage } from '@server/utils/gcp-storage'
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
    return await storage
      .bucket(`elevate-${repositoryId}-assets`)
      .file(`deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ repositoryId, deploymentId, id, buffer }: MetadataCacheInput & { buffer: string | Buffer }) => {
    await storage
      .bucket(`elevate-${repositoryId}-assets`)
      .file(`deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .save(buffer, { contentType: 'application/json' })
  },
}

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // c: contractAddress
  const { c: contractAddress, id } = req.query as { c: string; id: string }
  if (!contractAddress || !id) {
    return res.status(400).send('Bad Request')
  }

  // get the repository with repositoryId's layerElement, traitElements & rules with prisma
  const deployment = await prisma?.repositoryDeployment.findFirst({
    where: {
      contractDeployment: {
        address: contractAddress,
      },
    },
    include: {
      contractDeployment: true,
    },
  })

  if (!deployment || !deployment.contractDeployment) {
    return res.status(404).send('Not Found')
  }

  if (deployment.collectionTotalSupply <= parseInt(id)) {
    return res.status(400).send('Bad Request')
  }

  // check contract if token exists
  const currentTotalSupply = (await getTotalSupply(contractAddress, deployment.contractDeployment.chainId)).getValue()
  if (currentTotalSupply.lt(id)) {
    return res.status(400).send('Bad Request')
  }

  // look into cache whether image exist
  const metadata = await metadataCacheObject.get({ repositoryId: deployment.repositoryId, deploymentId: deployment.id, id })
  if (metadata) return res.setHeader('Content-Type', 'application/json').status(200).send(metadata)

  const layerElements = deployment.attributes as Prisma.JsonArray as v.Layer[]

  const tokens = v.one(
    v.parseLayer(layerElements),
    v.seed(deployment.repositoryId, deployment.collectionName, deployment.collectionGenerations, id)
  )

  const response = {
    image: `${env.NEXT_PUBLIC_API_URL}/asset/${contractAddress}/${id}`,
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
