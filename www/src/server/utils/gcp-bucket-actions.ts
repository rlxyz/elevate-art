import { storage } from '@server/utils/gcp-storage'

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
export type ImageCacheInput = { repositoryId: string; deploymentId: string; id: string }
export const imageCacheObject = {
  get: async ({ repositoryId, deploymentId, id }: ImageCacheInput) => {
    return await storage
      .bucket(`elevate-${repositoryId}-assets`)
      .file(`deployments/${deploymentId}/tokens/${id}/image.png`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ repositoryId, deploymentId, id, buffer }: ImageCacheInput & { buffer: Buffer }) => {
    await storage
      .bucket(`elevate-${repositoryId}-assets`)
      .file(`deployments/${deploymentId}/tokens/${id}/image.png`)
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
export type MetadataCacheInput = { repositoryId: string; deploymentId: string; id: string }
export const metadataCacheObject = {
  get: async ({ repositoryId, deploymentId, id }: MetadataCacheInput) => {
    return await storage
      .bucket(`elevate-${repositoryId}-assets`)
      .file(`deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .download()
      .then((data) => data[0])
      .catch((e) => console.error(e))
  },
  put: async ({ repositoryId, deploymentId, id, buffer }: MetadataCacheInput & { buffer: string | Buffer }) => {
    await storage
      .bucket(`elevate-${repositoryId}-assets`)
      .file(`deployments/${deploymentId}/tokens/${id}/metadata.json`)
      .save(buffer, { contentType: 'application/json' })
  },
}
