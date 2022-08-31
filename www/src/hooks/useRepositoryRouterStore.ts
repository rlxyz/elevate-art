import { LayerSectionType } from 'src/types/enums'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'
import * as z from 'zod'

// export type RepositoryRouterView = 'preview' | 'layers' | 'rarity' | 'rules'
export type RepositoryRouterLayerPriority = number

interface RepositoryRouterInterface {
  currentViewSection: LayerSectionType
  currentLayerPriority: number
  setCurrentViewSection: (view: LayerSectionType) => void
  setCurrentLayerPriority: (index: RepositoryRouterLayerPriority) => void
}

export const createRepositoryRouterStore = create<RepositoryRouterInterface>()(
  persist((set) => ({
    currentViewSection: 'preview',
    currentLayerPriority: 0,
    setCurrentViewSection: (view: LayerSectionType) => set((_) => ({ currentViewSection: view })),
    setCurrentLayerPriority: (index: RepositoryRouterLayerPriority) =>
      set((_) => ({ currentLayerPriority: index })),
  }))
)

export const RepositoryRouterContext = createContext<typeof createRepositoryRouterStore>()
const useRepositoryRouterStore = RepositoryRouterContext.useStore

export default useRepositoryRouterStore
