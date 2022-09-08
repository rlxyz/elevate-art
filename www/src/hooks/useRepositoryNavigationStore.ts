import { CollectionNavigationType } from 'src/types/enums'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

// export type RepositoryRouterView = 'preview' | 'layers' | 'rarity' | 'rules'
interface RepositoryNavigationInterface {
  currentViewSection: CollectionNavigationType
  currentLayerPriority: number
  setCurrentViewSection: (view: CollectionNavigationType) => void
  setCurrentLayerPriority: (index: number) => void
}

export const createRepositoryNavigationStore = create<RepositoryNavigationInterface>()(
  persist((set) => ({
    currentViewSection: 'preview',
    currentLayerPriority: 0,
    setCurrentViewSection: (view: CollectionNavigationType) => set((_) => ({ currentViewSection: view })),
    setCurrentLayerPriority: (index: number) => set((_) => ({ currentLayerPriority: index })),
  }))
)

export const RepositoryRouterContext = createContext<typeof createRepositoryNavigationStore>()
const useRepositoryNavigationStore = RepositoryRouterContext.useStore

export default useRepositoryNavigationStore
