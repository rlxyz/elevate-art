import { v2 } from "cloudinary";
import { env } from "../env/server.mjs";
import { Result } from "../utils/response-result";

/**
 * @important Note, this current implementation uses "Cloudinary Admin API" to delete files by
 * their public_id. This is not ideal as it only allows up to 2000 request per hour. At high transactional
 * rates, this will cause the server to fail. A better solution would be to use the "Cloudinary Upload API",
 * however, that requires iterating over all the files in the folder and deleting them individually.
 */

v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export type DeleteTraitElementResponse = {
  traitElementId: string;
  deleted: boolean;
};

const getDeleteTraitElementResponse = (response: { deleted: any }) => {
  return Object.entries(response.deleted).map(([key, value]) => ({
    traitElementId: key.split("/").pop() as string,
    deleted: !!(value === "deleted") as boolean,
  }));
};

/**
 * This function is used to delete a LayerElement folder from Cloudinary.
 *
 * @param files - An array of TraitElements to delete from Cloudinary, where, r = repositoryId, l = layerElementId, t = traitElementId
 */
export const deleteImageFilesFromCloudinary = (
  files: {
    r: string;
    l: string;
    t: string;
  }[],
): Promise<Result<DeleteTraitElementResponse[]>> => {
  return new Promise((resolve, reject) => {
    v2.api
      .delete_resources(
        files.map((x) => `${env.NODE_ENV}/${x.r}/${x.l}/${x.t}`),
        /** Invalidate Image in cdn */
        { invalidate: true },
      )
      .then((res) => resolve(Result.ok(getDeleteTraitElementResponse(res))))
      .catch((err) => reject(Result.fail(err.error.message)));
  });
};

/**
 * This function is used to delete a LayerElement folder from Cloudinary.
 *
 * @param r repositoryId
 * @param l layerElementId
 */
export const deleteImageFolderFromCloudinary = ({ r, l }: { r: string; l: string }): Promise<Result<DeleteTraitElementResponse[]>> => {
  return new Promise((resolve, reject) => {
    v2.api
      .delete_resources_by_prefix(`${env.NODE_ENV}/${r}/${l}`, {
        /** Invalidate Image in cdn */
        invalidate: true,
      })
      .then((res) => resolve(Result.ok(getDeleteTraitElementResponse(res))))
      .catch((err) => reject(Result.fail(err.error.message)));
  });
};
