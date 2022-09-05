import { LayerElement, TraitElement } from '@prisma/client'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface CompilerViewInterface {
  layerNames: string[]
  layerIds: string[]
  collectionId: string
  repositoryId: string
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
  resetTokens: (totalSupply: number) => void
  setRepositoryId: (repositoryId: string) => void
  setCollectionId: (collectionId: string) => void
  setLayerIds: (ids: string[]) => void
  setLayerNames: (names: string[]) => void
}

export const createRepositoryStore = create<CompilerViewInterface>()(
  persist((set) => ({
    layerNames: [],
    layerIds: [],
    repositoryId: '',
    collectionId: '',
    tokens: [],
    traitMapping: {
      tokenIdMap: new Map(),
      traitMap: new Map(),
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
    resetTokens: (totalSupply: number) => set((state) => ({ tokens: Array.from(Array(totalSupply).keys()) })),
    setTokens: (tokens: number[]) => set((_) => ({ tokens })),
    setTraitFilters: (filter) => set((state) => ({ traitFilters: [...state.traitFilters, filter] })),
    setTraitMapping: ({
      tokenIdMap,
      traitMap,
    }: {
      tokenIdMap: Map<string, Map<string, number[]>>
      traitMap: Map<string, Map<string, number>>
    }) => set((_) => ({ traitMapping: { tokenIdMap, traitMap } })),
    setRepositoryId: (repositoryId: string) => set((_) => ({ repositoryId })),
    setLayerNames: (names: string[]) => set((_) => ({ layerNames: names })),
    setLayerIds: (ids: string[]) => set((_) => ({ layerIds: ids })),
    setCollectionId: (collectionId: string) => set((_) => ({ collectionId })),
    setRegenerateFilterIndex: ({ start, end }: { start: number; end: number }) =>
      set((_) => ({ regenerateFilterIndex: { start, end } })),
    setRegenerateFilter: (regenerateFilter: boolean) => set((_) => ({ regenerateFilter })),
    setRegeneratePreview: (regenerate: boolean) => set((_) => ({ regeneratePreview: regenerate })),
    setRegenerateCollection: (regenerate: boolean) => set((_) => ({ regenerate })),
    setTokenRanking: (indices: number[]) => set((_) => ({ tokenRanking: indices })),
  }))
)

export const RepositoryContext = createContext<typeof createRepositoryStore>()
const useRepositoryStore = RepositoryContext.useStore

export default useRepositoryStore
