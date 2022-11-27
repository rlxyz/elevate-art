import { env } from 'src/env/server.mjs'

export const IMAGE_QUALITY_SETTINGS: string[] = ['c_scale,w_600', 'q_auto']
// export const IMAGE_QUALITY_SETTINGS: string[] = []
export const IMAGE_VERSION = 'v1'

export const getCldImgUrl = ({ r, l, t }: { r: string; l: string; t: string }) => {
  return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/${IMAGE_QUALITY_SETTINGS.join('/')}/${IMAGE_VERSION}/${
    env.NEXT_PUBLIC_NODE_ENV
  }/${r}/${l}/${t}.png`
}
