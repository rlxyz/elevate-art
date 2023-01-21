import type { AssetDeployment } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getTraitElementImageFromGCP } from '@server/utils/gcp-storage'
import { createCanvas } from '@server/utils/skia-canvas'
import type { Image } from 'canvas-constructor/skia'
import { resolveImage } from 'canvas-constructor/skia'

export const createTokenImageBuffer = async ({
  width,
  height,
  tokens,
  deployment,
}: {
  width: number
  height: number
  tokens: [string, string][]
  deployment: AssetDeployment
}) => {
  const canvas = createCanvas(width, height)
  const responses = tokens.map(([l, t]) => {
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

  await Promise.allSettled(responses).then((images) => {
    images.forEach((image) => {
      const { status } = image
      if (status === 'fulfilled') {
        const { value } = image
        canvas.printImage(value, 0, 0, width, height)
      } else {
        return null
      }
    })
  })

  return canvas.toBuffer('image/png')
}
