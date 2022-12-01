import * as z from "zod";

export const OrganisationNavigationEnum = z.nativeEnum(
  Object.freeze({
    You: "you", // only for personal accounts
    Dashboard: "dashboard", // only for personal accounts
    Account: "account", // only for personal accounts
    Overview: "overview", // only for team accounts
    Settings: "settings", // only for team accounts
    New: "new",
    Activity: "activity",
  }),
);
export type OrganisationNavigationType = z.infer<typeof OrganisationNavigationEnum>;

export const OrganisationSettingsNavigationEnum = z.nativeEnum(
  Object.freeze({
    General: "general",
    Team: "members",
  }),
);
export type OrganisationSettingsNavigationType = z.infer<typeof OrganisationSettingsNavigationEnum>;

export const RepositoryNavigationEnum = z.nativeEnum(
  Object.freeze({
    Dashboard: "dashboard",
  }),
);
export type RepositoryNavigationType = z.infer<typeof RepositoryNavigationEnum>;

export const CollectionNavigationEnum = z.nativeEnum(
  Object.freeze({
    Preview: "preview",
    Rarity: "rarity",
    Rules: "rules",
    Settings: "settings",
  }),
);
export type CollectionNavigationType = z.infer<typeof CollectionNavigationEnum>;

export const RepositorySectionEnum = z.nativeEnum(
  Object.freeze({
    Overview: "overview",
  }),
);
export type RepositorySectionType = z.infer<typeof CollectionNavigationEnum>;

export const RulesEnum = z.nativeEnum(
  Object.freeze({
    "cannot mix with": "cannot mix with",
    "must mix with": "must mix with",
  }),
);
export type RulesType = z.infer<typeof RulesEnum>;
