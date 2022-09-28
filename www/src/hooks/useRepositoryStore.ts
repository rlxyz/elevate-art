import { LayerElement, TraitElement } from '@prisma/client'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface RepositoryStoreStateInterface {
  rarityFilter: 'Top 10' | 'Middle 10' | 'Bottom 10' | 'All'
  traitFilteredTokens: number[]
  collectionId: string
  repositoryId: string
  traitFilters: { layer: LayerElement; trait: TraitElement }[]
  traitMapping: {
    tokenIdMap: Map<string, Map<string, number[]>>
    traitMap: Map<string, Map<string, number>>
  }
  tokenRanking: number[]
  tokens: number[]
}

interface RepositoryStoreFunctionInterface {
  setTokens: (tokens: number[]) => void
  setTraitMapping: ({
    tokenIdMap,
    traitMap,
  }: {
    tokenIdMap: Map<string, Map<string, number[]>>
    traitMap: Map<string, Map<string, number>>
  }) => void
  setRarityFilter: (filter: 'Top 10' | 'Middle 10' | 'Bottom 10' | 'All') => void
  setTokenRanking: (indices: number[]) => void
  setTraitFilters: (filters: { layer: LayerElement; trait: TraitElement }[]) => void
  setRepositoryId: (repositoryId: string) => void
  setCollectionId: (collectionId: string) => void
  setTraitFilteredTokens: (tokens: number[]) => void
  reset: () => void
}

interface RepositoryStoreInterface extends RepositoryStoreFunctionInterface, RepositoryStoreStateInterface {}

const initialState: RepositoryStoreStateInterface = {
  rarityFilter: 'All', // start with true to ensure that on hydrate preview is populated
  traitFilteredTokens: [],
  repositoryId: '',
  collectionId: '',
  tokens: [],
  traitMapping: {
    tokenIdMap: new Map(),
    traitMap: new Map(),
  },
  tokenRanking: [], // start with true to ensure that on hydrate preview is populated
  traitFilters: [], // start with true to ensure that on hydrate preview is populated
}

export const createRepositoryStore = create<RepositoryStoreInterface>()(
  persist(
    (set) => ({
      ...initialState,
      setTraitFilteredTokens: (tokens: number[]) => set((_) => ({ traitFilteredTokens: tokens })),
      setRarityFilter: (filter: 'Top 10' | 'Middle 10' | 'Bottom 10' | 'All') => set((_) => ({ rarityFilter: filter })),
      setTokens: (tokens: number[]) => set((_) => ({ tokens: tokens })),
      setTraitFilters: (filters: { layer: LayerElement; trait: TraitElement }[]) =>
        set((state) => ({ traitFilters: [...filters] })),
      setTraitMapping: ({
        tokenIdMap,
        traitMap,
      }: {
        tokenIdMap: Map<string, Map<string, number[]>>
        traitMap: Map<string, Map<string, number>>
      }) => set((_) => ({ traitMapping: { tokenIdMap, traitMap } })),
      setRepositoryId: (repositoryId: string) => set((_) => ({ repositoryId })),
      setCollectionId: (collectionId: string) => set((_) => ({ collectionId })),
      setTokenRanking: (indices: number[]) => set((_) => ({ tokenRanking: indices })),
      reset: () => set(initialState),
    }),
    { name: 'repositoryStore' }
  )
)

export const RepositoryContext = createContext<typeof createRepositoryStore>()
const useRepositoryStore = RepositoryContext.useStore

export default useRepositoryStore
