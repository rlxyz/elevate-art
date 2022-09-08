import * as z from 'zod'

const DashboardNavigation = Object.freeze({
  Dashboard: 'dashboard',
  Activity: 'dashboard/activity',
  Settings: 'account',
})

export const DashboardNavigationEnum = z.nativeEnum(DashboardNavigation)
export type DashboardNavigationType = z.infer<typeof DashboardNavigationEnum>

const CollectionNavigation = Object.freeze({
  Preview: 'preview',
  Layers: 'layers',
  Rarity: 'rarity',
  Rules: 'rules',
  Settings: 'settings',
})

export const CollectionNavigationEnum = z.nativeEnum(CollectionNavigation)
export type CollectionNavigationType = z.infer<typeof CollectionNavigationEnum>

const RepositorySection = Object.freeze({
  Overview: 'overview',
})
export const RepositorySectionEnum = z.nativeEnum(RepositorySection)
export type RepositorySectionType = z.infer<typeof CollectionNavigationEnum>

const Rules = Object.freeze({
  'cannot mix with': 'cannot mix with',
  // 'only mixes with': 'only mixes with',
})

export const RulesEnum = z.nativeEnum(Rules)
export type RulesType = z.infer<typeof RulesEnum>
