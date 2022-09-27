import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface CompilerViewInterface {
  rarityFilter: 'Top 10' | 'Middle 10' | 'Bottom 10' | 'All'
  traitFilteredTokens: number[]
  collectionId: string
  repositoryId: string
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
  setRarityFilter: (filter: 'Top 10' | 'Middle 10' | 'Bottom 10' | 'All') => void
  setTokenRanking: (indices: number[]) => void
  setTraitFilters: ({ trait_type, value }: { trait_type: string; value: string }) => void
  setRepositoryId: (repositoryId: string) => void
  setCollectionId: (collectionId: string) => void
  setTraitFilteredTokens: (tokens: number[]) => void
}

export const createRepositoryStore = create<CompilerViewInterface>()(
  persist(
    (set) => ({
      rarityFilter: 'All', // start with true to ensure that on hydrate preview is populated
      traitFilteredTokens: [],
      setTraitFilteredTokens: (tokens: number[]) => set((_) => ({ traitFilteredTokens: tokens })),
      setRarityFilter: (filter: 'Top 10' | 'Middle 10' | 'Bottom 10' | 'All') => set((_) => ({ rarityFilter: filter })),
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
      tokenRanking: [], // start with true to ensure that on hydrate preview is populated
      traitFilters: [], // start with true to ensure that on hydrate preview is populated
      setTokens: (tokens: number[]) => set((_) => ({ tokens: tokens })),
      setTraitFilters: (filter) => set((state) => ({ traitFilters: [...state.traitFilters, filter] })),
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
    }),
    { name: 'repositoryStore' }
  )
)

export const RepositoryContext = createContext<typeof createRepositoryStore>()
const useRepositoryStore = RepositoryContext.useStore

export default useRepositoryStore
