import { Result } from '@server/utils/response-result'
import { v2 } from 'cloudinary'
import { env } from 'src/env/server.mjs'

export const IMAGE_QUALITY_SETTINGS: unknown[] = [{ quality: 'auto' }, { width: 600, crop: 'scale' }]
export const IMAGE_VERSION = 'v1'

type GetTraitElementImageReturn = Result<Buffer | null>

export const getTraitElementImage = ({
  r,
  l,
  t,
  version = IMAGE_VERSION,
}: {
  r: string
  l: string
  t: string
  version?: string
}): Promise<GetTraitElementImageReturn> => {
  return new Promise(async (resolve, reject) => {
    const url = v2.url(`${env.NEXT_PUBLIC_NODE_ENV}/${r}/${l}/${t}.png`, {
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      secure: true,
      transformation: IMAGE_QUALITY_SETTINGS,
      // version: version,
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
      // secure: true,
      transformation: IMAGE_QUALITY_SETTINGS,
      // version: version,
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

export const getRepositoryLogoImage = ({
  r,
  version = IMAGE_VERSION,
}: {
  r: string
  version?: string
}): Promise<GetTraitElementImageReturn> => {
  return new Promise(async (resolve, reject) => {
    const url = v2.url(`${env.NEXT_PUBLIC_NODE_ENV}/${r}/assets/logo`, {
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      // secure: true,
      transformation: IMAGE_QUALITY_SETTINGS,
      // version: version,
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

export type TraitElementInfoResponse = {
  traitElementId: string
  version: string
}

export const getTraitElementInfo = ({ r, l, t }: { r: string; l: string; t: string }): Promise<Result<TraitElementInfoResponse>> => {
  return new Promise((resolve, reject) => {
    v2.api
      .resource(`${env.NEXT_PUBLIC_NODE_ENV}/${r}/${l}/${t}`)
      .then((result) => {
        const { version, public_id } = result as { version: number; public_id: string }
        return resolve(Result.ok({ traitElementId: public_id, version: `${version}` }))
      })
      .catch((error) => {
        console.log('error', error)
        reject(Result.fail(error))
      })
  })
}
