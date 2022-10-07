export const getImageForTrait = ({ r, l, t }: { r: string; l: string; t: string }) => {
  return `http://localhost:3000/api/image/${r}/${l}/${t}`
}
