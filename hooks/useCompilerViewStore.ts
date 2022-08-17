import {
  Collection as BaseCollection,
  LayerElement,
  Organisation,
  Repository,
} from '@utils/types'
import Collection from '@utils/x/Collection'
import create from 'zustand'

interface CompilerViewInterface {
  currentViewSection: number
  currentLayerPriority: number
  currentCustomRulesViewSection: number
  organisation: Organisation
  repository: Repository
  collection: BaseCollection
  artCollection: Collection
  layers: LayerElement[]
  currentLayer: LayerElement
  regenerate: boolean
  setCurrentCustomRulesViewSection: (index: number) => void
  setCurrentViewSection: (index: number) => void
  setCurrentLayerPriority: (index: number) => void
  setRegenerateCollection: (regenerate: boolean) => void
  setOrganisation: (organisation: Organisation) => void
  setRepository: (repository: Repository) => void
  setCollection: (collection: BaseCollection) => void
  setArtCollection: (collection: Collection) => void
  setLayers: (layers: LayerElement[]) => void
  setCurrentLayer: (priority: number) => void
}

const useCompilerViewStore = create<CompilerViewInterface>((set) => ({
  currentViewSection: 0,
  currentLayerPriority: 0,
  currentCustomRulesViewSection: null,
  repository: null,
  organisation: null,
  collection: null,
  layers: null,
  currentLayer: null,
  artCollection: null,
  regenerate: true,
  setCurrentViewSection: (index: number) =>
    set((_) => ({ currentViewSection: index })),
  setCurrentLayerPriority: (index: number) =>
    set((_) => ({ currentLayerPriority: index })),
  setOrganisation: (organisation: Organisation) =>
    set((_) => ({ organisation })),
  setRegenerateCollection: (regenerate: boolean) =>
    set((_) => ({ regenerate })),
  setRepository: (repository: Repository) => set((_) => ({ repository })),
  setCollection: (collection: BaseCollection) => set((_) => ({ collection })),
  setArtCollection: (artCollection: Collection) =>
    set((_) => ({ artCollection })),
  setLayers: (layers: LayerElement[]) => set((_) => ({ layers })),
  setCurrentLayer: (priority: number) =>
    set((state) => ({ currentLayer: state.layers[priority] })),
  setCurrentCustomRulesViewSection: (index: number) =>
    set((_) => ({ currentCustomRulesViewSection: index })),
}))

export default useCompilerViewStore
