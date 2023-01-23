import type { AssetDeployment } from '@prisma/client'
import { getTokenDeploymentBucket } from '@server/utils/gcp-storage'
import { Result } from '@server/utils/response-result'

export const saveImageToGcp = async ({
  deployment,
  tokenId,
  buf,
}: {
  deployment: AssetDeployment
  tokenId: number
  buf: Buffer
}): Promise<Result<boolean>> => {
  try {
    const _ = getTokenDeploymentBucket({
      branch: deployment.branch,
    })
      .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${tokenId}/image.png`)
      .save(buf, {
        resumable: false,
        validation: 'crc32c',
      })
    return Result.ok(true)
  } catch (err) {
    if (err instanceof Error) {
      return Result.fail('Something went wrong when saving to GCP' + err.message)
    }

    return Result.fail('Unknown Error when saving image to GCP')
  }
}
