import { Storage } from '@google-cloud/storage'
import { env } from 'src/env/server.mjs'
import { z } from 'zod'

/**
 * GCP Bucket Structure
 *
 * preview-deployments - single folder - acl-based auth - using signed urls
 * production-deployments - single folder - public folder - anyone can access - assets.elevate.art / staging.assets.elevate.art
 *
 * <branch>-deployments/<repositoryId>/<deploymentId>/tokens/<tokenId>/image.png
 * <branch>-deployments/<repositoryId>/<deploymentId>/tokens/<tokenId>/metadata.json
 */
export const storage = new Storage({
  projectId: env.GCP_PROJECT_ID,
  credentials: {
    client_email: env.GCP_CLIENT_EMAIL,
    private_key: env.GCP_PRIVATE_KEY,
  },
})

export const BucketEnum = z.enum(['deployment'])
export type BucketEnum = z.infer<typeof BucketEnum>

const getDeploymentBucket = ({ type }: { type: BucketEnum }) => {
  return storage.bucket(`elevate-${type}`)
}

export const getDeploymentBucketFile = ({ type, name }: { type: BucketEnum; name: string }) => {
  return getDeploymentBucket({ type }).file(name)
}

export const setDeploymentBucketFile = async ({ type, name, buffer }: { type: BucketEnum; name: string; buffer: Buffer }) => {
  return getDeploymentBucketFile({ type, name }).save(buffer, { contentType: 'image/png' })
}
