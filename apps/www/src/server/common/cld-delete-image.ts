import { v2 } from '@server/utils/cld-storage'
import { Result } from '@server/utils/response-result'
import { env } from 'src/env/server.mjs'

export type DeleteTraitElementResponse = {
  traitElementId: string
  deleted: boolean
}

const getDeleteTraitElementResponse = (response: { deleted: any }) => {
  return Object.entries(response.deleted).map(([key, value]) => ({
    traitElementId: key.split('/').pop() as string,
    deleted: !!(value === 'deleted') as boolean,
  }))
}

/**
 * This function is used to delete a LayerElement folder from Cloudinary.
 *
 * @param files - An array of TraitElements to delete from Cloudinary, where, r = repositoryId, l = layerElementId, t = traitElementId
 */
export const deleteImageFilesFromCloudinary = (
  files: {
    r: string
    l: string
    t: string
  }[]
): Promise<Result<DeleteTraitElementResponse[]>> => {
  return new Promise((resolve, reject) => {
    v2.api
      .delete_resources(
        files.map((x) => `${env.NEXT_PUBLIC_NODE_ENV}/${x.r}/${x.l}/${x.t}`),
        /** Invalidate Image in cdn */
        { invalidate: true }
      )
      .then((res) => resolve(Result.ok(getDeleteTraitElementResponse(res))))
      .catch((err) => reject(Result.fail(err.error.message)))
  })
}

/**
 * This function is used to delete a LayerElement folder from Cloudinary.
 *
 * @param r repositoryId
 * @param l layerElementId
 */
export const deleteImageFolderFromCloudinary = ({ r, l }: { r: string; l: string }): Promise<Result<DeleteTraitElementResponse[]>> => {
  return new Promise((resolve, reject) => {
    v2.api
      .delete_resources_by_prefix(`${env.NEXT_PUBLIC_NODE_ENV}/${r}/${l}`, {
        /** Invalidate Image in cdn */
        invalidate: true,
      })
      .then((res) => resolve(Result.ok(getDeleteTraitElementResponse(res))))
      .catch((err) => reject(Result.fail(err.error.message)))
  })
}
