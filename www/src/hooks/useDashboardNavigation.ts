import { DashboardNavigationType } from 'src/types/enums'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface DashboardNavigationInterface {
  currentRoute: DashboardNavigationType
  setCurrentViewSection: (view: DashboardNavigationType) => void
}

export const createDashboardNavigationStore = create<DashboardNavigationInterface>()(
  persist((set) => ({
    currentRoute: 'dashboard',
    setCurrentViewSection: (view: DashboardNavigationType) => set((_) => ({ currentRoute: view })),
  }))
)

export const DashboardRouterContext = createContext<typeof createDashboardNavigationStore>()
const useDashboardNavigationStore = DashboardRouterContext.useStore

export default useDashboardNavigationStore
