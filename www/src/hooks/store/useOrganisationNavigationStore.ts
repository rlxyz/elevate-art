import { OrganisationNavigationType } from 'src/types/enums'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface OrganisationNavigationInterface {
  organisationId: string | null
  currentRoute: OrganisationNavigationType
  setCurrentRoute: (view: OrganisationNavigationType) => void
  setOrganisationId: (id: string) => void
}

export const createOrganisationNavigationStore = create<OrganisationNavigationInterface>()(
  persist(
    (set) => ({
      organisationId: null,
      currentRoute: 'dashboard',
      setOrganisationId: (id: string) => set((_) => ({ organisationId: id })),
      setCurrentRoute: (view: OrganisationNavigationType) => set((_) => ({ currentRoute: view })),
    }),
    { name: 'organisationStore' }
  )
)

export const OrganisationRouterContext = createContext<typeof createOrganisationNavigationStore>()
const useOrganisationNavigationStore = OrganisationRouterContext.useStore

export default useOrganisationNavigationStore
