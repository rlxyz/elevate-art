import type { DownloadResponse } from '@google-cloud/storage'
import { Storage } from '@google-cloud/storage'
import type { AssetDeploymentBranch } from '@prisma/client'
import { env } from 'src/env/server.mjs'
import { Result } from './response-result'

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

type GetTraitElementImageReturn = Result<Buffer | null>

export const getTraitElementImageFromGCP = ({
  type,
  r,
  l,
  d,
  t,
}: {
  type: AssetDeploymentBranch
  r: string
  d: string
  l: string
  t: string
}): Promise<GetTraitElementImageReturn> => {
  return new Promise(async (resolve, reject) => {
    getAssetDeploymentBucket({ type })
      .file(`${r}/deployments/${d}/layers/${l}/${t}.png`)
      .download()
      .then((contents: DownloadResponse) => {
        if (contents[0]) resolve(Result.ok(contents[0]))
        reject(Result.fail('No image found'))
      })
      .catch((err) => {
        return reject(Result.fail(err))
      })
  })
}

/**
 * Note, this is a cache built around the compiler functionality to ensure that
 * we only need to compile a single token id once per deployment.
 *
 * That is, if a token has 12 LayerElements === 12 TraitElements, then we only need
 * to fetch from the GCP bucket once per token id.
 *
 * And during the compilation of images using skia-constructor, we re-upload the new compiled token image
 * to the GCP bucket.
 */
export type ImageCacheInput = { repositoryId: string; deploymentId: string; id: string; type: AssetDeploymentBranch }
export const imageCacheObject = {
  get: async ({ type, repositoryId, deploymentId, id }: ImageCacheInput) => {
    return await getAssetDeploymentBucket({ type })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/image.png`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ type, repositoryId, deploymentId, id, buffer }: ImageCacheInput & { buffer: Buffer }) => {
    await await getAssetDeploymentBucket({ type })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/image.png`)
      .save(buffer, { contentType: 'image/png' })
  },
}

/**
 * Note, this is a cache built around the compiler functionality to ensure that
 * we only need to compile a single token id once per deployment.
 *
 * That is, if a token has 12 LayerElements === 12 TraitElements, then we only need
 * to fetch from the GCP bucket once per token id.
 *
 * And during the compilation of images using skia-constructor, we re-upload the new compiled token image
 * to the GCP bucket.
 */
export type MetadataCacheInput = { repositoryId: string; deploymentId: string; id: string; type: AssetDeploymentBranch }
export const metadataCacheObject = {
  get: async ({ type, repositoryId, deploymentId, id }: MetadataCacheInput) => {
    return await getAssetDeploymentBucket({ type })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ type, repositoryId, deploymentId, id, buffer }: MetadataCacheInput & { buffer: string | Buffer }) => {
    await getAssetDeploymentBucket({ type })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .save(buffer, { contentType: 'application/json' })
  },
}
