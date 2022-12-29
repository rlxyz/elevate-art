import * as z from 'zod'

export const OrganisationDatabaseRoleEnum = z.nativeEnum(
  Object.freeze({
    Admin: 'admin',
    Curator: 'curator',
  })
)
export type OrganisationDatabaseRoleEnumType = z.infer<typeof OrganisationDatabaseRoleEnum>

export const OrganisationDatabaseEnum = z.nativeEnum(
  Object.freeze({
    Personal: 'personal',
    Team: 'team',
  })
)
export type OrganisationDatabaseType = z.infer<typeof OrganisationDatabaseEnum>

////////////////////////////////////////////////////////////////////////////////////

export const ZoneNavigationEnum = z.nativeEnum(
  Object.freeze({
    Dashboard: 'dashboard', // @todo tbr
    Create: 'create',
    Explore: 'explore',
    Deployments: 'deployments',
  })
)
export type ZoneNavigationType = z.infer<typeof ZoneNavigationEnum>

////////////////////////////////////////////////////////////////////////////////////

export const DashboardNavigationEnum = z.nativeEnum(
  Object.freeze({
    Dashboard: 'dashboard',
    Account: 'account',
  })
)

export type DashboardNavigationType = z.infer<typeof DashboardNavigationEnum>

////////////////////////////////////////////////////////////////////////////////////

export const OrganisationNavigationEnum = z.nativeEnum(
  Object.freeze({
    You: 'you', // only for personal accounts //! @todo doesn't exist anymore. remove
    Dashboard: 'dashboard', // only for personal accounts //! @todo doesn't exist anymore. remove.
    Account: 'account', // only for personal accounts // !@todo doesn't exist anymore. remove.
    Activity: 'activity', //! @todo doesn't exist anymore. remove.
    Overview: 'overview', // only for team accounts
    Settings: 'settings', // only for team accounts
    New: 'new',
  })
)

export type OrganisationNavigationType = z.infer<typeof OrganisationNavigationEnum>

/////////////////////

export const DeploymentNavigationEnum = z.nativeEnum(
  Object.freeze({
    Overview: 'overview',
    Settings: 'settings',
  })
)

/////////////////////

export const MintNavigationEnum = z.nativeEnum(
  Object.freeze({
    Mint: 'mint',
    Preview: 'preview',
    Gallery: 'gallery',
  })
)

export type MintNavigationType = z.infer<typeof MintNavigationEnum>

export const CollectionDatabaseEnum = z.nativeEnum(
  Object.freeze({
    Default: 'default',
    Development: 'development',
  })
)
export type CollectionDatabaseType = z.infer<typeof CollectionDatabaseEnum>

export const OrganisationSettingsNavigationEnum = z.nativeEnum(
  Object.freeze({
    General: 'general',
    Team: 'members',
  })
)
export type OrganisationSettingsNavigationType = z.infer<typeof OrganisationSettingsNavigationEnum>

export const RepositoryNavigationEnum = z.nativeEnum(
  Object.freeze({
    Dashboard: 'dashboard',
  })
)
export type RepositoryNavigationType = z.infer<typeof RepositoryNavigationEnum>

export const ContractSettingsNavigationEnum = z.nativeEnum(
  Object.freeze({
    Details: 'details',
    Mechanics: 'mechanics',
    Revenue: 'revenue',
    Allowlist: 'allowlist',
    Deploy: 'deploy',
  })
)
export type ContractSettingsNavigationType = z.infer<typeof ContractSettingsNavigationEnum>

export const CollectionNavigationEnum = z.nativeEnum(
  Object.freeze({
    Preview: 'preview',
    Rarity: 'rarity',
    Rules: 'rules',
    Settings: 'settings',
  })
)
export type CollectionNavigationType = z.infer<typeof CollectionNavigationEnum>

export const CollectionSettingsNavigationEnum = z.nativeEnum(
  Object.freeze({
    General: 'general',
  })
)

export const AssetDeploymentNavigationEnum = z.nativeEnum(
  Object.freeze({
    Overview: 'overview',
    Contract: 'contract',
    Settings: 'settings',
  })
)

export type AssetDeploymentNavigationType = z.infer<typeof CollectionNavigationEnum>

export const RepositorySectionEnum = z.nativeEnum(
  Object.freeze({
    Overview: 'overview',
  })
)
export type RepositorySectionType = z.infer<typeof CollectionNavigationEnum>

export const RulesEnum = z.nativeEnum(
  Object.freeze({
    'cannot mix with': 'cannot mix with',
    'must mix with': 'must mix with',
  })
)
export type RulesType = z.infer<typeof RulesEnum>
