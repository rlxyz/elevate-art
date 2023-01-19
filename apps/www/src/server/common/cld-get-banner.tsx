import { Result } from '@server/utils/response-result'
import { v2 } from 'cloudinary'
import { env } from 'src/env/server.mjs'
import type { GetTraitElementImageReturn } from './cld-get-image'
import { IMAGE_VERSION } from './cld-get-image'

export const getRepositoryBannerImage = ({
  r,
  version = IMAGE_VERSION,
}: {
  r: string
  version?: string
}): Promise<GetTraitElementImageReturn> => {
  return new Promise(async (resolve, reject) => {
    const url = v2.url(`${env.NEXT_PUBLIC_NODE_ENV}/${r}/assets/banner`, {
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      transformation: [{ quality: 'auto' }, { width: 1400, height: 350, crop: 'scale' }],
    })
    fetch(url)
      .then(async (res) => {
        const blob = await res.blob()
        const buffer = Buffer.from(await blob.arrayBuffer())
        return resolve(Result.ok(buffer))
      })
      .catch((err) => {
        return reject(Result.fail(err))
      })
  })
}
