import type { AssetDeployment } from '@prisma/client'
import { getTraitElementImageFromGCP } from '@server/common/gcp-save-trait-element'
import type { Image } from '@server/utils/napi-canvas'
import { createCanvas, loadImage } from '@server/utils/napi-canvas'

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
  const ctx = canvas.getContext('2d')
  const responses = tokens.map(([l, t]) => {
    return new Promise<Image>(async (resolve, reject) => {
      const response = await getTraitElementImageFromGCP({
        r: deployment.repositoryId,
        d: deployment.id,
        l,
        t,
      })
      if (response.failed) return reject()
      const buffer = response.getValue()
      if (!buffer) return reject()
      return resolve(await loadImage(buffer))
    })
  })

  await Promise.allSettled(responses).then((images) => {
    images.forEach((image) => {
      const { status } = image
      if (status === 'fulfilled') {
        const { value } = image
        ctx.drawImage(value, 0, 0, width, height)
      } else {
        return null
      }
    })
  })

  return canvas.toBuffer('image/png')
}
