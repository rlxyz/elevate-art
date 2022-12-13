import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { getTraitElementImageFromGCP } from '@server/common/gcp-get-image'
import { imageCacheObject } from '@server/utils/gcp-bucket-actions'
import type { Image } from 'canvas-constructor/skia'
import { Canvas, resolveImage } from 'canvas-constructor/skia'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as v from 'src/shared/compiler'

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // o: organisationName, r: repositoryName, id
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
    include: { contractDeployment: true },
  })

  if (!deployment || !deployment.contractDeployment) {
    return res.status(404).send('Not Found')
  }

  const { contractDeployment } = deployment

  if (deployment.totalSupply <= parseInt(id)) {
    return res.status(400).send('Bad Request')
  }

  // check contract if token exists
  const currentTotalSupply = (await getTotalSupply(contractDeployment.address, contractDeployment.chainId)).getValue()
  if (currentTotalSupply.lt(id)) {
    return res.status(400).send('Bad Request')
  }

  // look into cache whether image exist
  const image = await imageCacheObject.get({ repositoryId: deployment.repositoryId, deploymentId: deployment.id, id })
  if (image) return res.setHeader('Content-Type', 'image/png').status(200).send(image)

  const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

  const tokens = v.one(v.parseLayer(layerElements), v.seed(deployment.repositoryId, deployment.slug, deployment.generations, id))

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
