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
export const deleteImageFromCloudinary = ({
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
