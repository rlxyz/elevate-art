import type { AssetDeployment } from '@prisma/client'
import { getTraitElementImageFromGCP } from '@server/common/gcp-save-trait-element'
import type { Image } from '@server/utils/napi-canvas'
import { createCanvas, loadImage } from '@server/utils/napi-canvas'
import { Result } from '@server/utils/response-result'

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
}): Promise<Result<Buffer>> => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const responses = tokens.map(([l, t]) => {
    return new Promise<Image>(async (resolve, reject) => {
      try {
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
      } catch (error) {
        if (error instanceof Error) {
          return reject('Something went wrong when quering the image' + error.message)
        }
        return reject('Something went wrong when quering the image')
      }
    })
  })

  await Promise.allSettled(responses).then((images) => {
    images.forEach((image) => {
      const { status } = image
      if (status === 'fulfilled') {
        const { value } = image
        ctx.drawImage(value, 0, 0, width, height)
      } else {
        return Result.fail('Something went wrong when quering the image')
      }
    })
  })

  return Result.ok(canvas.toBuffer('image/png'))
}
