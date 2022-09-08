import * as z from 'zod'

const OrganisationNavigation = Object.freeze({
  Dashboard: 'dashboard',
  Activity: 'activity',
  Settings: 'account',
})

export const OrganisationNavigationEnum = z.nativeEnum(OrganisationNavigation)
export type OrganisationNavigationType = z.infer<typeof OrganisationNavigationEnum>

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

export const CollectionTitleContent = Object.freeze({
  preview: {
    title: 'Preview Collection',
    description: 'Create different token sets before finalising the collection',
  },
  layers: { title: 'All Layers', description: 'View and edit layers of your collection' },
  rarity: {
    title: 'Rarity',
    description: 'Set how often you want certain images to appear in the generation',
  },
  rules: {
    title: 'Custom Rules',
    description: 'Add custom rules for your traits so it layers perfectly!',
  },
  settings: {
    title: 'Collection Settings',
    description: '',
  },
})
