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

export const getAssetDeploymentBucketName = ({ branch }: { branch: AssetDeploymentBranch }) => {
  if (env.NEXT_PUBLIC_NODE_ENV === 'production') return `elevate-asset-deployment-${branch}-main`.toLowerCase()
  if (env.NEXT_PUBLIC_NODE_ENV === 'staging') return `elevate-asset-deployment-${branch}-staging`.toLowerCase()
  return `elevate-asset-deployment-${branch}-localhost`.toLowerCase()
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

type GetTraitElementImageReturn = Result<Buffer | null>

export const getTraitElementImageFromGCP = ({
  branch,
  r,
  l,
  d,
  t,
}: {
  branch: AssetDeploymentBranch
  r: string
  d: string
  l: string
  t: string
}): Promise<GetTraitElementImageReturn> => {
  return new Promise<Result<Buffer>>(async (resolve, reject) => {
    getAssetDeploymentBucket({ branch })
      .file(`${r}/deployments/${d}/layers/${l}/${t}.png`)
      .download()
      .then((contents: DownloadResponse) => {
        if (contents[0]) resolve(Result.ok(Buffer.from(contents[0])))
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
export type ImageCacheInput = { repositoryId: string; deploymentId: string; id: string; branch: AssetDeploymentBranch }
export const imageCacheObject = {
  get: async ({ branch, repositoryId, deploymentId, id }: ImageCacheInput) => {
    return await getAssetDeploymentBucket({ branch })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/image.png`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ branch, repositoryId, deploymentId, id, buffer }: ImageCacheInput & { buffer: Buffer }) => {
    await await getAssetDeploymentBucket({ branch })
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
export type MetadataCacheInput = { repositoryId: string; deploymentId: string; id: string; branch: AssetDeploymentBranch }
export const metadataCacheObject = {
  get: async ({ branch: branch, repositoryId, deploymentId, id }: MetadataCacheInput) => {
    return await getAssetDeploymentBucket({ branch })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ branch: branch, repositoryId, deploymentId, id, buffer }: MetadataCacheInput & { buffer: string | Buffer }) => {
    await getAssetDeploymentBucket({ branch })
      .file(`${repositoryId}/deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .save(buffer, { contentType: 'application/json' })
  },
}
