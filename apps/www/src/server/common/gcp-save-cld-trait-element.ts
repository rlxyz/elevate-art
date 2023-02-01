import { getLayerDeploymentBucket } from '@server/utils/gcp-storage'
import { Result } from '@server/utils/response-result'
import type * as v from 'src/shared/compiler'
import { getTraitElementImage } from './cld-get-image'

export const fetchAndSaveAllTraitElementsToGCP = ({
  layerElements,
  repositoryId,
  deploymentId,
}: {
  layerElements: v.Layer[]
  repositoryId: string
  deploymentId: string
}): Promise<Result<{ r: string; l: string; t: string }>>[] => {
  return layerElements
    .flatMap((x) => x.traits.map((y) => ({ ...y, lid: x.id })))
    .map(
      async ({ id: t, lid: l }) =>
        new Promise(async (resolve, reject) => {
          /** Fetch and Svave */
          const response = await fetchAndSaveTraitElementToGCP({ r: repositoryId, deploymentId, l, t })
          if (response.failed) {
            return reject(Result.fail('Could not get image from Cloudinary'))
          }

          /** Return Success */
          return resolve(Result.ok({ r: repositoryId, l: l, t: t }))
        })
    )
}

export const fetchAndSaveTraitElementToGCP = async ({
  deploymentId,
  r,
  l,
  t,
}: {
  deploymentId: string
  r: string
  l: string
  t: string
}): Promise<Result<boolean>> => {
  /** Fetch Image */
  const response = await getTraitElementImage({ r, l, t })
  if (response.failed) {
    return Result.fail('Could not get image from Cloudinary')
  }

  /* Get Buffer */
  const buffer = response.getValue()
  if (!buffer) {
    return Result.fail('Could not get image buffer from Cloudinary image')
  }

  try {
    console.log('fetched image', { r, l, t })

    /* Save Image */
    const _ = await getLayerDeploymentBucket()
      .file(`${r}/deployments/${deploymentId}/layers/${l}/${t}.png`)
      .save(Buffer.from(buffer), { contentType: 'image/png' })

    console.log('saved image', { r, l, t })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }

    console.log('failed to save image', { r, l, t })
    return Result.fail('Could not save image to GCP Storage')
  }

  /* Return Success */
  return Result.ok(true)
}
