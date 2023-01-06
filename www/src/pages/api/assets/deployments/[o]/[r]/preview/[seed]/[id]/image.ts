import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import { generateSeedBasedOnAssetDeploymentType } from '@server/common/v-get-token-seed'
import { getTraitElementImageFromGCP } from '@server/utils/gcp-storage'
import type { Image } from 'canvas-constructor/skia'
import { Canvas, resolveImage } from 'canvas-constructor/skia'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as v from 'src/shared/compiler'

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
  const deployment = await prisma?.assetDeployment.findFirst({
    where: {
      branch: AssetDeploymentBranch.PREVIEW,
      repository: {
        name: repositoryName,
        organisation: {
          name: organisationName,
          members: {
            some: { userId: session.user.id },
          },
        },
      },
      name: seed,
    },
    include: { repository: true, contractDeployment: true },
  })

  if (!deployment) {
    return res.status(404).send('Not Found')
  }

  if (!deployment.contractDeployment) {
    return res.status(404).send('Not Found')
  }

  if (deployment.totalSupply <= parseInt(id)) {
    return res.status(400).send('Bad Request')
  }

  const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

  const seedResponse = await generateSeedBasedOnAssetDeploymentType(deployment, deployment.contractDeployment, parseInt(id))
  if (seedResponse.failed) {
    return res.status(404).send('Not Found')
  }
  const vseed = seedResponse.getValue()
  const tokens = v.one(v.parseLayer(layerElements), vseed)
  const width = deployment.repository.width
  const height = deployment.repository.height

  const canvas = new Canvas(width, height)

  const response = await Promise.all(
    tokens.reverse().map(([l, t]) => {
      return new Promise<Image>(async (resolve, reject) => {
        const response = await getTraitElementImageFromGCP({
          branch: AssetDeploymentBranch.PREVIEW,
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
    canvas.printImage(image, 0, 0, width, height)
  })

  const buf = await canvas.toBufferAsync('image/png')

  return res.setHeader('Content-Type', 'image/png').status(200).send(buf)
}

export default index
