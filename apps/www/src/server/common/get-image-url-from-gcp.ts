import type { AssetDeployment } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { getAssetDeploymentBucket, getAssetDeploymentBucketName } from '@server/utils/gcp-storage'

export const getImageUrlFromGcp = async ({ deployment, tokenId }: { deployment: AssetDeployment; tokenId: number }) => {
  const [exists] = await getAssetDeploymentBucket({ branch: deployment.branch })
    .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${tokenId}/image.png`)
    .exists()

  if (!exists) {
    return null
  }

  if (deployment.branch === AssetDeploymentBranch.PREVIEW) {
    const [url] = await getAssetDeploymentBucket({ branch: AssetDeploymentBranch.PREVIEW })
      .file(`${deployment.repositoryId}/deployments/${deployment.id}/tokens/${tokenId}/image.png`)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      })

    return url
  } else if (deployment.branch === AssetDeploymentBranch.PRODUCTION) {
    const url = `https://storage.googleapis.com/${getAssetDeploymentBucketName({ branch: AssetDeploymentBranch.PRODUCTION })}/${
      deployment.repositoryId
    }/deployments/${deployment.id}/tokens/${tokenId}/image.png`

    return url
  }

  return null
}
