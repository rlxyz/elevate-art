import { AssetDeploymentBranch } from '@prisma/client'
import { ZoneNavigationEnum } from '@utils/enums'
import { env } from 'src/env/client.mjs'

export const getImageForTrait = ({ r, l, t }: { r: string; l: string; t: string }) => {
  return `${env.NEXT_PUBLIC_ASSET_URL}/${ZoneNavigationEnum.enum.Create}/${r}/${l}/${t}`
}

export const getBannerForRepository = ({ r }: { r: string }) => {
  return `${env.NEXT_PUBLIC_ASSET_URL}/${ZoneNavigationEnum.enum.Create}/${r}/banner`
}

export const getLogoForRepository = ({ r }: { r: string }) => {
  return `${env.NEXT_PUBLIC_ASSET_URL}/${ZoneNavigationEnum.enum.Create}/${r}/logo`
}

export const getDeploymentTokenImage = ({
  o,
  r,
  d,
  branch,
  tokenId,
}: {
  r: string
  o: string
  branch: AssetDeploymentBranch
  tokenId: string | number
  d?: string
}): string => {
  return [
    env.NEXT_PUBLIC_ASSET_URL,
    ZoneNavigationEnum.enum.Deployments,
    o,
    r,
    branch === AssetDeploymentBranch.PREVIEW && `preview/${d}`,
    tokenId,
    'image',
  ]
    .filter((x) => Boolean(x))
    .join('/')
}
