import { OrganisationNavigationType } from 'src/types/enums'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface OrganisationNavigationInterface {
  currentRoute: OrganisationNavigationType
  setCurrentRoute: (view: OrganisationNavigationType) => void
}

export const createOrganisationNavigationStore = create<OrganisationNavigationInterface>()(
  persist((set) => ({
    currentRoute: 'dashboard',
    setCurrentRoute: (view: OrganisationNavigationType) => set((_) => ({ currentRoute: view })),
  }))
)

export const OrganisationRouterContext = createContext<typeof createOrganisationNavigationStore>()
const useOrganisationNavigationStore = OrganisationRouterContext.useStore

export default useOrganisationNavigationStore
