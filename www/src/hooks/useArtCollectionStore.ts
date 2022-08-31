import { App } from '@utils/x/App'
import ArtCollection from '@utils/x/Collection'
import create, { StoreApi } from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface CompilerViewInterface {
  artCollection: ArtCollection
  setArtCollection: (collection: ArtCollection) => void
}

export const useArtCollectionStore = create<CompilerViewInterface>((set) => ({
  artCollection: new ArtCollection({
    tokens: [],
    data: [],
    totalSupply: 0,
  }),
  setArtCollection: (artCollection: ArtCollection) => set((_) => ({ artCollection })),
}))
