import type { AssetDeployment } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getTokenDeploymentBucket, getTokenDeploymentBucketName } from '@server/utils/gcp-storage'
import { Result } from '@server/utils/response-result'

export const getImageUrlFromGcp = async ({
  deployment,
  tokenId,
}: {
  deployment: AssetDeployment
  tokenId: number
}): Promise<Result<string>> => {
  const [exists] = await getTokenDeploymentBucket({ branch: deployment.branch })
    .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${tokenId}/image.png`)
    .exists()

  if (!exists) {
    return Result.fail('Image does not exist')
  }

  if (deployment.branch !== AssetDeploymentBranch.PREVIEW) {
    const [signedUrl] = await getTokenDeploymentBucket({ branch: deployment.branch })
      .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${tokenId}/image.png`)
      .getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000,
      })

    return Result.ok(signedUrl)
  } else if (deployment.branch === AssetDeploymentBranch.PREVIEW) {
    const url = `https://storage.googleapis.com/${getTokenDeploymentBucketName({
      branch: deployment.branch,
    })}/${deployment.repositoryId}/deployments/${deployment.id}/tokens/${tokenId}/image.png`

    return Result.ok(url)
  }

  return Result.fail('Could not get image url')
}
