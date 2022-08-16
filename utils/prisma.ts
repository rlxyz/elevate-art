import {
  LayerElement as PrismaLayerModel,
  PrismaClient,
  TraitElement as PrismaTraitModel,
} from '@prisma/client'
import { getAddress } from 'ethers/lib/utils'

import {
  ArtElement,
  Collection,
  LayerElement,
  Organisation,
  PrismaArtElement,
  PrismaCollection,
  PrismaLayerElement,
  PrismaOrganisation,
  PrismaRepository,
  PrismaTraitElement,
  PrismaUser,
  Repository,
  TraitElement,
  User,
} from './types'

export const createPrismaClient = (): PrismaClient => {
  return new PrismaClient()
}

export const convertPrismaUser = (user: PrismaUser): User => {
  return {
    id: user.id,
    address: getAddress(user.address),
    organisations: user.organisations?.map((organisation: PrismaOrganisation) =>
      convertPrismaOrganisation(organisation)
    ),
  }
}

export const convertPrismaOrganisation = (
  organisation: PrismaOrganisation
): Organisation => {
  return {
    id: organisation.id,
    name: organisation.name,
    ownerId: organisation.ownerId,
    repositories: organisation.repositories?.map(
      (repository: PrismaRepository) => convertPrismaRepository(repository)
    ),
  }
}

export const convertPrismaRepository = (
  repository: PrismaRepository
): Repository => {
  return {
    id: repository.id,
    name: repository.name,
    tokenName: repository.tokenName,
    layers: convertPrismaLayers(repository.layers),
    collections: repository.collections?.map((collection: PrismaCollection) =>
      convertPrismaCollection(collection)
    ),
    organisationId: repository.organisationId,
  }
}

export const convertPrismaCollection = (
  collection: PrismaCollection
): Collection => {
  return {
    id: collection.id,
    name: collection.name,
    totalSupply: collection.totalSupply,
    repositoryId: collection.repositoryId,
    artElement: collection.artElements?.map((artElement: PrismaArtElement) =>
      convertPrismaArtElement(artElement)
    ),
  }
}

export const convertPrismaLayers = (
  layers: PrismaLayerElement[]
): LayerElement[] => {
  return layers.map((layer: PrismaLayerElement) => {
    return {
      id: layer.id,
      name: layer.name,
      priority: layer.priority,
      repositoryId: layer.repositoryId,
      traits: layer.traitElements.map((trait: PrismaTraitModel) =>
        convertPrismaTraitElement(trait)
      ),
    }
  })
}

function convertPrismaArtElement(artElement: PrismaArtElement): ArtElement {
  console.log(artElement)
  return {
    id: artElement.id,
    collectionId: artElement.collectionId,
    // traitElement: JSON.parse(artElement.traits.toString()).map(
    //   (traitElement: PrismaTraitModel) => {
    //     console.log(traitElement)
    //     return
    //   }
    // ),
  }
}

export const convertPrismaTraitElement = (
  traitElement: PrismaTraitElement
): TraitElement => {
  return {
    id: traitElement.id,
    name: traitElement.name,
    weight: traitElement.weight,
    layerElementId: traitElement.layerElementId,
  }
}
