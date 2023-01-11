import type { Prisma } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { generateSeedBasedOnAssetDeploymentType } from '@server/common/v-get-token-seed'
import { getAssetDeploymentBucket, getAssetDeploymentBucketName, getTraitElementImageFromGCP } from '@server/utils/gcp-storage'
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
      branch: AssetDeploymentBranch.PRODUCTION,
      repository: {
        name: repositoryName,
        organisation: {
          name: organisationName,
        },
      },
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

  const [exists] = await getAssetDeploymentBucket({ branch: AssetDeploymentBranch.PRODUCTION })
    .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${id}/image.png`)
    .exists()

  if (exists) {
    const url = `https://storage.googleapis.com/${getAssetDeploymentBucketName({ branch: AssetDeploymentBranch.PRODUCTION })}/${
      deployment.repositoryId
    }/deployments/${deployment.id}/tokens/${id}/image.png`
    return res.setHeader('Cache-Control', 'public, s-maxage=31536000, max-age=31536000, immutable').redirect(307, url)
  }

  const layerElements = deployment.layerElements as Prisma.JsonArray as v.Layer[]

  const seedResponse = await generateSeedBasedOnAssetDeploymentType(deployment, deployment.contractDeployment, parseInt(id))
  if (seedResponse.failed) {
    return res.status(404).send('Not Found')
  }
  console.log(seedResponse.getValue())
  const vseed = seedResponse.getValue()
  const tokens = v.one(v.parseLayer(layerElements.sort((a, b) => a.priority - b.priority)), vseed)
  const width = deployment.repository.width
  const height = deployment.repository.height

  const canvas = new Canvas(width, height)

  const response = await Promise.all(
    tokens.map(([l, t]) => {
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

  // const buf = await sharp(await canvas.toBufferAsync('image/png'))
  //   .png({ quality: 70 })
  //   .toBuffer()

  // only ever runs once...
  const buf = await canvas.toBufferAsync('image/png')

  await getAssetDeploymentBucket({ branch: AssetDeploymentBranch.PRODUCTION })
    .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${id}/image.png`)
    .save(buf)

  const url = `https://storage.googleapis.com/${getAssetDeploymentBucketName({ branch: AssetDeploymentBranch.PRODUCTION })}/${
    deployment.repositoryId
  }/deployments/${deployment.id}/tokens/${id}/image.png`

  return res.setHeader('Cache-Control', 'public, s-maxage=31536000, max-age=31536000, immutable').redirect(307, url)
}

export default index
