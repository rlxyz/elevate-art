import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface CollectionNavigationStateInterface {
  currentLayerPriority: string | null
}

interface CollectionNavigationFunctionInterface {
  setCurrentLayerPriority: (index: string) => void
}

interface CollectionNavigationInterface extends CollectionNavigationFunctionInterface, CollectionNavigationStateInterface {}

const initialState: CollectionNavigationStateInterface = {
  currentLayerPriority: null,
}

export const createCollectionNavigationStore = create<CollectionNavigationInterface>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentLayerPriority: (priority: string) => set((_) => ({ currentLayerPriority: priority })),
      reset: () => set(initialState),
    }),
    { name: 'collectionStore' }
  )
)

export const CollectionRouterContext = createContext<typeof createCollectionNavigationStore>()
const useCollectionNavigationStore = CollectionRouterContext.useStore

export default useCollectionNavigationStore
