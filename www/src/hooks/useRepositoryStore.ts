import {
  Collection,
  LayerElement,
  Organisation,
  Repository,
  Rules,
  TraitElement
} from '@prisma/client'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface CompilerViewInterface {
  organisation: Organisation
  repository: Repository
  collection: Collection
  layers: (LayerElement & {
    traitElements: (TraitElement & {
      rulesPrimary: (Rules & {
        primaryTraitElement: TraitElement & { layerElement: LayerElement }
        secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      })[]
      rulesSecondary: (Rules & {
        primaryTraitElement: TraitElement & { layerElement: LayerElement }
        secondaryTraitElement: TraitElement & { layerElement: LayerElement }
      })[]
    })[]
  })[]
  currentLayer: LayerElement & {
    traitElements: TraitElement[]
  }
  regenerate: boolean
  regenerateFilterIndex: { start: number; end: number }
  regenerateFilter: boolean
  regeneratePreview: boolean
  traitFilters: { trait_type: string; value: string }[]
  traitMapping: {
    tokenIdMap: Map<string, Map<string, number[]>>
    traitMap: Map<string, Map<string, number>>
  }
  tokenRanking: number[]
  tokens: number[]
  setTokens: (tokens: number[]) => void
  setTraitMapping: ({
    tokenIdMap,
    traitMap,
  }: {
    tokenIdMap: Map<string, Map<string, number[]>>
    traitMap: Map<string, Map<string, number>>
  }) => void
  setRegenerateFilterIndex: ({ start, end }: { start: number; end: number }) => void
  setTokenRanking: (indices: number[]) => void
  setTraitFilters: ({ trait_type, value }: { trait_type: string; value: string }) => void
  setRegenerateFilter: (regenerateFilter: boolean) => void
  setRegeneratePreview: (regenerate: boolean) => void
  setRegenerateCollection: (regenerate: boolean) => void
  resetTokens: () => void
  setOrganisation: (organisation: Organisation) => void
  setRepository: (repository: Repository) => void
  setCollection: (collection: Collection) => void
  setLayers: (
    layers: (LayerElement & {
      traitElements: (TraitElement & {
        rulesPrimary: (Rules & {
          primaryTraitElement: TraitElement & { layerElement: LayerElement }
          secondaryTraitElement: TraitElement & { layerElement: LayerElement }
        })[]
        rulesSecondary: (Rules & {
          primaryTraitElement: TraitElement & { layerElement: LayerElement }
          secondaryTraitElement: TraitElement & { layerElement: LayerElement }
        })[]
      })[]
    })[]
  ) => void
  setCurrentLayer: (priority: number) => void
}

export const createRepositoryStore = create<CompilerViewInterface>()(
  persist((set) => ({
    tokens: [],
    traitMapping: {
      tokenIdMap: new Map(),
      traitMap: new Map(),
    },
    repository: {
      id: '',
      name: '',
      tokenName: '',
      organisationId: '',
      createdAt: new Date(-1),
      updatedAt: new Date(-1),
    },
    organisation: {
      id: '',
      name: '',
      ownerId: '',
      createdAt: new Date(-1),
      updatedAt: new Date(-1),
    },
    collection: {
      id: '',
      name: '',
      totalSupply: 0,
      repositoryId: '',
      generations: 0,
      createdAt: new Date(-1),
      updatedAt: new Date(-1),
    },
    layers: [],
    currentLayer: {
      id: '',
      name: '',
      priority: 0,
      repositoryId: '',
      createdAt: new Date(-1),
      updatedAt: new Date(-1),
      traitElements: [],
    },
    regenerate: false,
    regenerateFilterIndex: { start: 0, end: 0 }, // start with true to ensure that on hydrate preview is populated
    regenerateFilter: false, // start with true to ensure that on hydrate preview is populated
    regeneratePreview: true, // start with true to ensure that on hydrate preview is populated
    tokenRanking: [], // start with true to ensure that on hydrate preview is populated
    traitFilters: [], // start with true to ensure that on hydrate preview is populated
    resetTokens: () =>
      set((state) => ({ tokens: Array.from(Array(state.collection.totalSupply).keys()) })),
    setTokens: (tokens: number[]) => set((_) => ({ tokens })),
    setTraitFilters: (filter) =>
      set((state) => ({ traitFilters: [...state.traitFilters, filter] })),
    setTraitMapping: ({
      tokenIdMap,
      traitMap,
    }: {
      tokenIdMap: Map<string, Map<string, number[]>>
      traitMap: Map<string, Map<string, number>>
    }) => set((_) => ({ traitMapping: { tokenIdMap, traitMap } })),
    setOrganisation: (organisation: Organisation) => set((_) => ({ organisation })),
    setRegenerateFilterIndex: ({ start, end }: { start: number; end: number }) =>
      set((_) => ({ regenerateFilterIndex: { start, end } })),
    setRegenerateFilter: (regenerateFilter: boolean) => set((_) => ({ regenerateFilter })),
    setRegeneratePreview: (regenerate: boolean) => set((_) => ({ regeneratePreview: regenerate })),
    setRegenerateCollection: (regenerate: boolean) => set((_) => ({ regenerate })),
    setRepository: (repository: Repository) => set((_) => ({ repository })),
    setCollection: (collection: Collection) => set((_) => ({ collection })),
    setTokenRanking: (indices: number[]) => set((_) => ({ tokenRanking: indices })),
    setLayers: (
      layers: (LayerElement & {
        traitElements: (TraitElement & {
          rulesPrimary: (Rules & {
            primaryTraitElement: TraitElement & { layerElement: LayerElement }
            secondaryTraitElement: TraitElement & { layerElement: LayerElement }
          })[]
          rulesSecondary: (Rules & {
            primaryTraitElement: TraitElement & { layerElement: LayerElement }
            secondaryTraitElement: TraitElement & { layerElement: LayerElement }
          })[]
        })[]
      })[]
    ) => set((_) => ({ layers })),
    setCurrentLayer: (priority: number) =>
      set((state) => ({ currentLayer: state.layers[priority] })),
  }))
)

export const RepositoryContext = createContext<typeof createRepositoryStore>()
const useRepositoryStore = RepositoryContext.useStore

export default useRepositoryStore
