import { useHotkeys } from 'react-hotkeys-hook'
import { CollectionNavigationEnum } from 'src/types/enums'
import { useQueryRepositoryLayer } from '../query/useQueryRepositoryLayer'
import useCollectionNavigationStore from '../store/useCollectionNavigationStore'

export const useKeybordShortcuts = () => {
  const { all: layers } = useQueryRepositoryLayer()

  const { setCurrentViewSection, setCurrentLayerPriority, currentLayerPriority } = useCollectionNavigationStore((state) => {
    return {
      setCurrentViewSection: state.setCurrentViewSection,
      setCurrentLayerPriority: state.setCurrentLayerPriority,
      currentLayerPriority: state.currentLayerPriority,
      currentViewSection: state.currentViewSection,
    }
  })

  const getLayerId = (index: number) => {
    if (!layers) return ''
    if (index === -1) return layers[-1]?.id || ''
    return layers.find((layer) => layer.priority === index)?.id || ''
  }

  useHotkeys('shift+1', () => layers && layers.length > 0 && setCurrentLayerPriority(getLayerId(0)))
  useHotkeys('shift+2', () => layers && layers.length > 1 && setCurrentLayerPriority(getLayerId(1)))
  useHotkeys('shift+3', () => layers && layers.length > 3 && setCurrentLayerPriority(getLayerId(2)))
  useHotkeys('shift+4', () => layers && layers.length > 4 && setCurrentLayerPriority(getLayerId(3)))
  useHotkeys('shift+5', () => layers && layers.length > 5 && setCurrentLayerPriority(getLayerId(4)))
  useHotkeys('shift+6', () => layers && layers.length > 6 && setCurrentLayerPriority(getLayerId(5)))
  useHotkeys('shift+7', () => layers && layers.length > 7 && setCurrentLayerPriority(getLayerId(6)))
  useHotkeys('shift+8', () => layers && layers.length > 8 && setCurrentLayerPriority(getLayerId(7)))
  useHotkeys('shift+9', () => layers && layers.length > 9 && setCurrentLayerPriority(getLayerId(-1)))
  // useHotkeys(
  //   'shift+cmd+up',
  //   () => currentLayerPriority > 0 && setCurrentLayerPriority(currentLayerPriority - 1),
  //   {
  //     keydown: true,
  //   },
  //   [currentLayerPriority, setCurrentLayerPriority]
  // )
  // useHotkeys(
  //   'shift+cmd+down',
  //   () => currentLayerPriority + 1 < layers && layers\.length && setCurrentLayerPriority(currentLayerPriority + 1),
  //   {
  //     keydown: true,
  //   },
  //   [currentLayerPriority, setCurrentLayerPriority]
  // )
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
  useHotkeys('ctrl+1', () => setCurrentViewSection(CollectionNavigationEnum.enum.Preview))
  useHotkeys('ctrl+2', () => setCurrentViewSection(CollectionNavigationEnum.enum.Rarity))
  useHotkeys('ctrl+3', () => setCurrentViewSection(CollectionNavigationEnum.enum.Rules))
  // useHotkeys('ctrl+g', () => setRegenerateCollection(true))
  // useHotkeys('ctrl+r', () => setRegeneratePreview(true))
}
