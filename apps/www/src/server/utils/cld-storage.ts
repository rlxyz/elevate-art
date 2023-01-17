import { v2 } from 'cloudinary'
import { env } from 'src/env/server.mjs'

/**
 * @important Note, this current implementation uses "Cloudinary Admin API" to delete files by
 * their public_id. This is not ideal as it only allows up to 2000 request per hour. At high transactional
 * rates, this will cause the server to fail. A better solution would be to use the "Cloudinary Upload API",
 * however, that requires iterating over all the files in the folder and deleting them individually.
 */

v2.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

export { v2 }
