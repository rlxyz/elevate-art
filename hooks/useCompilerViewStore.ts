import {
  Collection as BaseCollection,
  LayerElement,
  Organisation,
  Repository,
} from '@utils/types'
import { App } from '@utils/x/App'
import ArtCollection from '@utils/x/Collection'
import create, { StoreApi } from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface CompilerViewInterface {
  currentViewSection: number
  currentLayerPriority: number
  currentCustomRulesViewSection: number
  app: App
  organisation: Organisation
  repository: Repository
  collection: BaseCollection
  artCollection: ArtCollection
  layers: LayerElement[]
  currentLayer: LayerElement
  regenerate: boolean
  regenerateFilterIndex: { start: number; end: number }
  regenerateFilter: boolean
  regeneratePreview: boolean
  traitFilters: { trait_type: string; value: string }[]
  setApp: (app: App) => void
  setCurrentCustomRulesViewSection: (index: number) => void
  setCurrentViewSection: (index: number) => void
  setCurrentLayerPriority: (index: number) => void
  setRegenerateFilterIndex: ({
    start,
    end,
  }: {
    start: number
    end: number
  }) => void
  setTraitFilters: ({
    trait_type,
    value,
  }: {
    trait_type: string
    value: string
  }) => void
  setRegenerateFilter: (regenerateFilter: boolean) => void
  setRegeneratePreview: (regenerate: boolean) => void
  setRegenerateCollection: (regenerate: boolean) => void
  setOrganisation: (organisation: Organisation) => void
  setRepository: (repository: Repository) => void
  setCollection: (collection: BaseCollection) => void
  setArtCollection: (collection: ArtCollection) => void
  setLayers: (layers: LayerElement[]) => void
  setCurrentLayer: (priority: number) => void
}

export const createRepositoryStore = create<CompilerViewInterface>()((set) => ({
  currentViewSection: 0,
  currentLayerPriority: 0,
  currentCustomRulesViewSection: 0,
  app: null,
  repository: null,
  organisation: null,
  collection: null,
  layers: null,
  currentLayer: null,
  artCollection: null,
  regenerate: false,
  regenerateFilterIndex: { start: 0, end: 0 }, // start with true to ensure that on hydrate preview is populated
  regenerateFilter: false, // start with true to ensure that on hydrate preview is populated
  regeneratePreview: true, // start with true to ensure that on hydrate preview is populated
  traitFilters: [], // start with true to ensure that on hydrate preview is populated
  setApp: (app: App) => set((_) => ({ app })),
  setCurrentViewSection: (index: number) =>
    set((_) => ({ currentViewSection: index })),
  setTraitFilters: (filter) =>
    set((state) => ({ traitFilters: [...state.traitFilters, filter] })),
  setCurrentLayerPriority: (index: number) =>
    set((_) => ({ currentLayerPriority: index })),
  setOrganisation: (organisation: Organisation) =>
    set((_) => ({ organisation })),
  setRegenerateFilterIndex: ({ start, end }: { start: number; end: number }) =>
    set((_) => ({ regenerateFilterIndex: { start, end } })),
  setRegenerateFilter: (regenerateFilter: boolean) =>
    set((_) => ({ regenerateFilter })),
  setRegeneratePreview: (regenerate: boolean) =>
    set((_) => ({ regeneratePreview: regenerate })),
  setRegenerateCollection: (regenerate: boolean) =>
    set((_) => ({ regenerate })),
  setRepository: (repository: Repository) => set((_) => ({ repository })),
  setCollection: (collection: BaseCollection) => set((_) => ({ collection })),
  setArtCollection: (artCollection: ArtCollection) =>
    set((_) => ({ artCollection })),
  setLayers: (layers: LayerElement[]) => set((_) => ({ layers })),
  setCurrentLayer: (priority: number) =>
    set((state) => ({ currentLayer: state.layers[priority] })),
  setCurrentCustomRulesViewSection: (index: number) =>
    set((_) => ({ currentCustomRulesViewSection: index })),
}))

export const RepositoryContext = createContext<typeof createRepositoryStore>()
const useRepositoryStore = RepositoryContext.useStore

export default useRepositoryStore
