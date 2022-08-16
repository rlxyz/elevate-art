import {
  User as PrismaUserModel,
  Organisation as PrismaOrganisationModel,
  Repository as PrismaRepositoryModel,
  Collection as PrismaCollectionModel,
  LayerElement as PrismaLayerModel,
  TraitElement as PrismaTraitModel,
  ArtElement as PrismaArtModel,
} from '@prisma/client'

export type PrismaUser = PrismaUserModel & {
  organisations: PrismaOrganisationModel[]
}
export type PrismaOrganisation = PrismaOrganisationModel & {
  repositories: PrismaRepositoryModel[]
}
export type PrismaRepository = PrismaRepositoryModel & {
  collections: PrismaCollectionModel[]
} & { layers: PrismaLayerElement[] }

export type PrismaCollection = PrismaCollectionModel & {
  artElements: PrismaArtModel[]
}
export type PrismaArtElement = PrismaArtModel

export type PrismaLayerElement = PrismaLayerModel & {
  traitElements: PrismaTraitModel[]
}
export type PrismaTraitElement = PrismaTraitModel

export type User = {
  id: string
  address: string
  organisations: Organisation[]
}

export type Organisation = {
  id: string
  name: string
  ownerId: string

  repositories?: Repository[]
}

export type Repository = {
  id: string
  name: string
  tokenName: string
  organisationId: string

  layers?: LayerElement[]
  collections?: Collection[]
}

export type Collection = {
  id: string
  name: string
  totalSupply: number
  repositoryId: string

  artElement?: ArtElement[]
}

export type LayerElement = {
  id: string
  name: string
  priority: number
  repositoryId: string

  traits?: TraitElement[]
}

export type TraitElement = {
  id: string
  name: string
  weight: number
  layerElementId: string
}

export type ArtElement = {
  id: number
  collectionId: string
  // traitElementsObject: any
}
