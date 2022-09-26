import { CollectionNavigationType } from 'src/types/enums'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface CollectionNavigationInterface {
  currentViewSection: CollectionNavigationType
  currentLayerPriority: string
  setCurrentViewSection: (view: CollectionNavigationType) => void
  setCurrentLayerPriority: (index: string) => void
}

export const createCollectionNavigationStore = create<CollectionNavigationInterface>()(
  persist((set) => ({
    currentViewSection: 'preview',
    currentLayerPriority: '',
    setCurrentViewSection: (view: CollectionNavigationType) => set((_) => ({ currentViewSection: view })),
    setCurrentLayerPriority: (index: string) => set((_) => ({ currentLayerPriority: index })),
  }))
)

export const CollectionRouterContext = createContext<typeof createCollectionNavigationStore>()
const useCollectionNavigationStore = CollectionRouterContext.useStore

export default useCollectionNavigationStore
