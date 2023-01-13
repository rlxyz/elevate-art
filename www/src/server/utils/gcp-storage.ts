import { Storage } from '@google-cloud/storage'
import type { AssetDeploymentBranch } from '@prisma/client'
import { env } from 'src/env/server.mjs'

/**
 * GCP Bucket Structure
 *
 * preview-deployments - single folder - acl-based auth - using signed urls
 * production-deployments - single folder - public folder - anyone can access - assets.elevate.art / staging.assets.elevate.art
 *
 * elevate-assset-deployment-<branch>/<repositoryId>/<deploymentId>/tokens/<tokenId>/image.png
 * elevate-assset-deployment-<branch>/<repositoryId>/<deploymentId>/tokens/<tokenId>/metadata.json
 */
export const storage = new Storage({
  projectId: env.GCP_PROJECT_ID,
  credentials: {
    client_email: env.GCP_CLIENT_EMAIL,
    private_key: env.GCP_PRIVATE_KEY,
  },
})

export const getAssetDeploymentBucketName = ({ branch }: { branch: AssetDeploymentBranch }) => {
  return `elevate-asset-deployment-${branch}`.toLowerCase()
}

export const getAssetDeploymentBucket = ({ branch }: { branch: AssetDeploymentBranch }) => {
  return storage.bucket(getAssetDeploymentBucketName({ branch }))
}

export const getAssetDeploymentBucketFile = ({ branch, name }: { branch: AssetDeploymentBranch; name: string }) => {
  return getAssetDeploymentBucket({ branch }).file(name)
}

export const setAssetDeploymentBucketFile = async ({
  branch,
  name,
  buffer,
}: {
  branch: AssetDeploymentBranch
  name: string
  buffer: Buffer
}) => {
  return getAssetDeploymentBucket({ branch }).file(name).save(buffer, { contentType: 'image/png' })
}
