import { CollectionNavigationType } from 'src/types/enums'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

// export type RepositoryRouterView = 'preview' | 'layers' | 'rarity' | 'rules'
interface CollectionNavigationInterface {
  currentViewSection: CollectionNavigationType
  currentLayerPriority: number
  setCurrentViewSection: (view: CollectionNavigationType) => void
  setCurrentLayerPriority: (index: number) => void
}

export const createCollectionNavigationStore = create<CollectionNavigationInterface>()(
  persist((set) => ({
    currentViewSection: 'preview',
    currentLayerPriority: 0,
    setCurrentViewSection: (view: CollectionNavigationType) => set((_) => ({ currentViewSection: view })),
    setCurrentLayerPriority: (index: number) => set((_) => ({ currentLayerPriority: index })),
  }))
)

export const CollectionRouterContext = createContext<typeof createCollectionNavigationStore>()
const useCollectionNavigationStore = CollectionRouterContext.useStore

export default useCollectionNavigationStore
