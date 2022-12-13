import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { metadataCacheObject } from '@server/utils/gcp-bucket-actions'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from 'src/env/server.mjs'
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
      type: AssetDeploymentBranch.PRODUCTION,
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
  const metadata = await metadataCacheObject.get({ repositoryId: deployment.repositoryId, deploymentId: deployment.id, id })
  if (metadata) return res.setHeader('Content-Type', 'application/json').status(200).send(metadata)

  const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

  const tokens = v.one(v.parseLayer(layerElements), v.seed(deployment.repositoryId, deployment.slug, deployment.generations, id))

  const response = {
    name: `${deployment.repository.tokenName} #${id}`,
    image: `${env.NEXT_PUBLIC_API_URL}/asset/${organisationName}/${repositoryName}/${id}/image`,
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
