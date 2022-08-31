import { useHotkeys } from 'react-hotkeys-hook'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { LayerSectionEnum } from 'src/types/enums'
import useRepositoryRouterStore from './useRepositoryRouterStore'

export const useKeybordShortcuts = () => {
  const { layers, setRegeneratePreview, setRegenerateCollection } = useRepositoryStore((state) => {
    return {
      layers: state.layers,
      setRegeneratePreview: state.setRegeneratePreview,
      setRegenerateCollection: state.setRegenerateCollection,
    }
  })

  const { setCurrentViewSection, setCurrentLayerPriority, currentLayerPriority } =
    useRepositoryRouterStore((state) => {
      return {
        setCurrentViewSection: state.setCurrentViewSection,
        setCurrentLayerPriority: state.setCurrentLayerPriority,
        currentLayerPriority: state.currentLayerPriority,
        currentViewSection: state.currentViewSection,
      }
    })

  useHotkeys('shift+1', () => layers.length > 0 && setCurrentLayerPriority(0))
  useHotkeys('shift+2', () => layers.length > 1 && setCurrentLayerPriority(1))
  useHotkeys('shift+3', () => layers.length > 3 && setCurrentLayerPriority(2))
  useHotkeys('shift+4', () => layers.length > 4 && setCurrentLayerPriority(3))
  useHotkeys('shift+5', () => layers.length > 5 && setCurrentLayerPriority(4))
  useHotkeys('shift+6', () => layers.length > 6 && setCurrentLayerPriority(5))
  useHotkeys('shift+7', () => layers.length > 7 && setCurrentLayerPriority(6))
  useHotkeys('shift+8', () => layers.length > 8 && setCurrentLayerPriority(7))
  useHotkeys('shift+9', () => layers.length > 9 && setCurrentLayerPriority(layers.length - 1))
  useHotkeys(
    'shift+cmd+up',
    () => currentLayerPriority > 0 && setCurrentLayerPriority(currentLayerPriority - 1),
    {
      keydown: true,
    },
    [currentLayerPriority, setCurrentLayerPriority]
  )
  useHotkeys(
    'shift+cmd+down',
    () =>
      currentLayerPriority + 1 < layers.length && setCurrentLayerPriority(currentLayerPriority + 1),
    {
      keydown: true,
    },
    [currentLayerPriority, setCurrentLayerPriority]
  )
  // useHotkeys(
  //   'shift+cmd+right',
  //   () => currentViewSection + 1 < 4 && setCurrentViewSection(currentViewSection + 1),
  //   {
  //     keydown: true,
  //   },
  //   [currentViewSection, setCurrentViewSection]
  // )
  // useHotkeys(
  //   'shift+cmd+left',
  //   () => currentViewSection > 0 && setCurrentViewSection(currentViewSection - 1),
  //   {
  //     keydown: true,
  //   },
  //   [currentViewSection, setCurrentViewSection]
  // )
  useHotkeys('ctrl+1', () => setCurrentViewSection(LayerSectionEnum.enum.Preview))
  useHotkeys('ctrl+2', () => setCurrentViewSection(LayerSectionEnum.enum.Layers))
  useHotkeys('ctrl+3', () => setCurrentViewSection(LayerSectionEnum.enum.Rarity))
  useHotkeys('ctrl+4', () => setCurrentViewSection(LayerSectionEnum.enum.Rules))
  useHotkeys('ctrl+g', () => setRegenerateCollection(true))
  useHotkeys('ctrl+r', () => setRegeneratePreview(true))
}
