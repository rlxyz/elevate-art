import { AssetDeploymentBranch } from '@prisma/client'
import { getAssetDeploymentBucket } from '@server/utils/gcp-storage'
import { Result } from '@server/utils/response-result'
import * as v from 'src/shared/compiler'
import { getTraitElementImage } from './cld-get-image'

export const fetchAndSaveAllTraitElementsToGCP = ({
  layerElements,
  repositoryId,
  deploymentId,
  branch,
}: {
  layerElements: v.Layer[]
  repositoryId: string
  deploymentId: string
  branch: AssetDeploymentBranch
}): Promise<Result<{ r: string; l: string; t: string }>>[] => {
  return layerElements
    .flatMap((x) => x.traits.map((y) => ({ ...y, lid: x.id })))
    .map(
      async ({ id: t, lid: l }) =>
        new Promise(async (resolve, reject) => {
          /** Fetch and Svave */
          const response = await fetchAndSaveTraitElementToGCP({ r: repositoryId, deploymentId, l, t, branch })
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
  branch,
}: {
  deploymentId: string
  r: string
  l: string
  t: string
  branch: AssetDeploymentBranch
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

  /* Save Image */
  const _ = await getAssetDeploymentBucket({ branch })
    .file(`${r}/deployments/${deploymentId}/layers/${l}/${t}.png`)
    .save(Buffer.from(buffer), { contentType: 'image/png' })

  /* Return Success */
  return Result.ok(true)
}
