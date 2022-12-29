import { env } from 'src/env/client.mjs'

export const getImageForTrait = ({ r, l, t }: { r: string; l: string; t: string }) => {
  return `${env.NEXT_PUBLIC_API_URL}/image/${r}/${l}/${t}`
}

export const getBannerForRepository = ({ r }: { r: string }) => {
  return `${env.NEXT_PUBLIC_API_URL}/image/${r}/banner`
}

export const getLogoForRepository = ({ r }: { r: string }) => {
  return `${env.NEXT_PUBLIC_API_URL}/image/${r}/logo`
}
