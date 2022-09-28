import { CollectionNavigationEnum, CollectionNavigationType } from 'src/types/enums'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface CollectionNavigationStateInterface {
  currentViewSection: CollectionNavigationType
  currentLayerPriority: string | null
}

interface CollectionNavigationFunctionInterface {
  setCurrentViewSection: (view: CollectionNavigationType) => void
  setCurrentLayerPriority: (index: string) => void
}

interface CollectionNavigationInterface extends CollectionNavigationFunctionInterface, CollectionNavigationStateInterface {}

const initialState: CollectionNavigationStateInterface = {
  currentViewSection: CollectionNavigationEnum.enum.Preview,
  currentLayerPriority: null,
}

export const createCollectionNavigationStore = create<CollectionNavigationInterface>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentViewSection: (view: CollectionNavigationType) => set((_) => ({ currentViewSection: view })),
      setCurrentLayerPriority: (priority: string) => set((_) => ({ currentLayerPriority: priority })),
      reset: () => set(initialState),
    }),
    { name: 'collectionStore' }
  )
)

export const CollectionRouterContext = createContext<typeof createCollectionNavigationStore>()
const useCollectionNavigationStore = CollectionRouterContext.useStore

export default useCollectionNavigationStore
