import { v2 } from 'cloudinary'
import { clientEnv } from 'src/env/schema.mjs'
import { env } from 'src/env/server.mjs'

v2.config({
  cloud_name: clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

// Source: https://cloudinary.com/documentation/image_upload_api_reference#destroy_method
// @todo more roboust promise
export const deleteImageFileFromCloudinary = ({
  r,
  l,
  t,
}: {
  r: string
  l: string
  t: string
}): Promise<{ result: 'Ok' | 'Error' }> => {
  return new Promise((resolve, reject) => {
    v2.uploader
      .destroy(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${r}/${l}/${t}`, {
        invalidate: true, // force invalidate cdn
      })
      .then((res) =>
        resolve({
          result: 'Ok',
        })
      )
      .catch((err) =>
        reject({
          result: 'Error',
        })
      )
  })
}

export const deleteImageFolderFromCloudinary = ({ r, l }: { r: string; l: string }): Promise<{ result: 'Ok' | 'Error' }> => {
  return new Promise((resolve, reject) => {
    v2.api
      .delete_resources_by_prefix(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${r}/${l}`, {
        invalidate: true, // force invalidate cdn
      })
      .then((res) =>
        resolve({
          result: 'Ok',
        })
      )
      .catch((err) =>
        reject({
          result: 'Error',
        })
      )
  })
}
