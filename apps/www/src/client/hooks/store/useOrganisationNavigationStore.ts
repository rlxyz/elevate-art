import {
  OrganisationNavigationEnum,
  OrganisationNavigationType,
  OrganisationSettingsNavigationEnum,
  OrganisationSettingsNavigationType,
} from "src/shared/enums";
import create from "zustand";
import createContext from "zustand/context";
import { persist } from "zustand/middleware";

interface OrganisationNavigationInterface {
  organisationId: string | null;
  currentRoute: OrganisationNavigationType;
  currentSettingsRoute: OrganisationSettingsNavigationType;
  setCurrentSettingsRoute: (view: OrganisationSettingsNavigationType) => void;
  setCurrentRoute: (view: OrganisationNavigationType) => void;
  setOrganisationId: (id: string) => void;
}

export const createOrganisationNavigationStore =
  create<OrganisationNavigationInterface>()(
    persist(
      (set) => ({
        organisationId: null,
        currentRoute: OrganisationNavigationEnum.enum.Dashboard,
        currentSettingsRoute: OrganisationSettingsNavigationEnum.enum.General,
        setOrganisationId: (id: string) => set((_) => ({ organisationId: id })),
        setCurrentSettingsRoute: (view: OrganisationSettingsNavigationType) =>
          set((_) => ({ currentSettingsRoute: view })),
        setCurrentRoute: (view: OrganisationNavigationType) =>
          set((_) => ({ currentRoute: view })),
      }),
      { name: "organisationStore" },
    ),
  );

export const OrganisationRouterContext =
  createContext<typeof createOrganisationNavigationStore>();
const useOrganisationNavigationStore = OrganisationRouterContext.useStore;

export default useOrganisationNavigationStore;
