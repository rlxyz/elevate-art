import { Storage } from '@google-cloud/storage'
import { AssetDeploymentBranch } from '@prisma/client'
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

export const getAssetDeploymentBucketName = ({ type }: { type: AssetDeploymentBranch }) => {
  return `elevate-asset-deployment-${type}`.toLowerCase()
}

export const getAssetDeploymentBucket = ({ type }: { type: AssetDeploymentBranch }) => {
  return storage.bucket(getAssetDeploymentBucketName({ type }))
}

export const getAssetDeploymentBucketFile = ({ type, name }: { type: AssetDeploymentBranch; name: string }) => {
  return getAssetDeploymentBucket({ type }).file(name)
}

export const setAssetDeploymentBucketFile = async ({
  type,
  name,
  buffer,
}: {
  type: AssetDeploymentBranch
  name: string
  buffer: Buffer
}) => {
  return getAssetDeploymentBucket({ type }).file(name).save(buffer, { contentType: 'image/png' })
}
