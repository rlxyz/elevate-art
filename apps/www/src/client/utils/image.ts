import type { ContractDeployment } from '@prisma/client'
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

export const getSyncedBaseURI = ({ contractDeployment }: { contractDeployment: ContractDeployment }) => {
  return `${env.NEXT_PUBLIC_ASSET_URL}/${ZoneNavigationEnum.enum.Deployments}/${contractDeployment.chainId}/${contractDeployment.address}/` //! remember to add trailing slash
}

export const getTokenURI = ({ contractDeployment, tokenId }: { contractDeployment: ContractDeployment; tokenId: string | number }) => {
  return `${getSyncedBaseURI({ contractDeployment })}${tokenId}`
}

export const getTokenImageURI = ({ contractDeployment, tokenId }: { contractDeployment: ContractDeployment; tokenId: string | number }) => {
  return `https://storage.googleapis.com/elevate-assets-deployment-tokens-${AssetDeploymentBranch.PRODUCTION.toLowerCase()}-${
    env.NEXT_PUBLIC_NODE_ENV
  }/deployments/${contractDeployment.chainId}/${contractDeployment.address}/tokens/${tokenId}/1/image.png`
}

export const getOwnerOf = ({ contractDeployment, tokenId }: { contractDeployment: ContractDeployment; tokenId: string | number }) => {
  return `${env.NEXT_PUBLIC_ASSET_URL}/${ZoneNavigationEnum.enum.Deployments}/${contractDeployment.chainId}/${contractDeployment.address}/${tokenId}/owner`
}

export const getTokenRank = ({ contractDeployment, tokenId }: { contractDeployment: ContractDeployment; tokenId: string | number }) => {
  return `${env.NEXT_PUBLIC_ASSET_URL}/${ZoneNavigationEnum.enum.Deployments}/${contractDeployment.chainId}/${contractDeployment.address}/${tokenId}/analytics/rank`
}

export const getCollectionRarity = ({ contractDeployment }: { contractDeployment: ContractDeployment }) => {
  return `${env.NEXT_PUBLIC_ASSET_URL}/${ZoneNavigationEnum.enum.Deployments}/${contractDeployment.chainId}/${contractDeployment.address}/analytics/rarity`
}

export const getTokenImageURILegacy = ({
  contractDeployment,
  tokenId,
}: {
  contractDeployment: ContractDeployment
  tokenId: string | number
}) => {
  return `${getSyncedBaseURI({ contractDeployment })}${tokenId}/image`
}

export const getTokenMetadataURI = ({
  contractDeployment,
  tokenId,
}: {
  contractDeployment: ContractDeployment
  tokenId: string | number
}) => {
  return `${getSyncedBaseURI({ contractDeployment })}${tokenId}`
}
