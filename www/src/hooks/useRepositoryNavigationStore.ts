import { RepositoryNavigationType } from 'src/types/enums'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface RepositoryNavigationInterface {
  currentRoute: RepositoryNavigationType
  setCurrentRoute: (view: RepositoryNavigationType) => void
}

export const createRepositoryNavigationStore = create<RepositoryNavigationInterface>()(
  persist((set) => ({
    currentRoute: 'dashboard',
    setCurrentRoute: (view: RepositoryNavigationType) => set((_) => ({ currentRoute: view })),
  }))
)

export const RepositoryRouterContext = createContext<typeof createRepositoryNavigationStore>()
const useRepositoryNavigationStore = RepositoryRouterContext.useStore

export default useRepositoryNavigationStore
