import type { Bucket } from '@google-cloud/storage'
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
  retryOptions: {
    autoRetry: true,
    maxRetries: 3,
  },
})

export const BUCKET_LAYER_DEPLOYMENT = 'elevate-assets-deployment-layers-private' // all layers images are in private bucket. benefits: only owners can see layers.
export const BUCKET_TOKEN_DEPLOYMENT_PRODUCTION = `elevate-assets-deployment-tokens-${AssetDeploymentBranch.PRODUCTION}`.toLowerCase()
export const BUCKET_TOKEN_DEPLOYMENT_PREVIEW = `elevate-assets-deployment-tokens-${AssetDeploymentBranch.PREVIEW}`.toLowerCase()

/**
 * This is the bucket that stores the layer images with their associated Traits.
 */
export const getLayerDeploymentBucketName = () => {
  if (env.NEXT_PUBLIC_NODE_ENV === 'production') return `${BUCKET_LAYER_DEPLOYMENT}-production`.toLowerCase()
  if (env.NEXT_PUBLIC_NODE_ENV === 'staging') return `${BUCKET_LAYER_DEPLOYMENT}-staging`.toLowerCase()
  return `${BUCKET_LAYER_DEPLOYMENT}-localhost`.toLowerCase()
}

export const getLayerDeploymentBucket = () => {
  return storage.bucket(getLayerDeploymentBucketName())
}

/**
 * This is the bucket that stores the layer images with their associated Traits.
 */
export const getTokenDeploymentBucketName = ({ branch }: { branch: AssetDeploymentBranch }) => {
  const bucket = branch === AssetDeploymentBranch.PREVIEW ? BUCKET_TOKEN_DEPLOYMENT_PREVIEW : BUCKET_TOKEN_DEPLOYMENT_PRODUCTION
  if (env.NEXT_PUBLIC_NODE_ENV === 'production') return `${bucket}-production`.toLowerCase()
  if (env.NEXT_PUBLIC_NODE_ENV === 'staging') return `${bucket}-staging`.toLowerCase()
  return `${bucket}-localhost`.toLowerCase()
}

export const getTokenDeploymentBucket = ({ branch }: { branch: AssetDeploymentBranch }): Bucket => {
  if (branch === AssetDeploymentBranch.PREVIEW)
    return storage.bucket(
      getTokenDeploymentBucketName({
        branch,
      })
    )

  return storage.bucket(
    getTokenDeploymentBucketName({
      branch,
    })
  )
}
