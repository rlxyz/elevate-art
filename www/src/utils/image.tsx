import { clientEnv } from 'src/env/schema.mjs'

export const getImageForTrait = ({ r, l, t }: { r: string; l: string; t: string }) => {
  return `${clientEnv.NEXT_PUBLIC_API_URL}/image/${r}/${l}/${t}`
}
