import { LayerElement } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { FC } from 'react'
import { LayerElementFileTreeItem } from './LayerElementFileTreeItem'

interface Props {
  items: LayerElement[]
  itemEnabledIndex: number
}

export type LayerElementFileSelectorProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * This is the core LayerElementFileSelector component, it allows users to be routed
 * to a specific layer element by clicking on it
 *
 * It maintains two states, one for the layer element that is currently being hovered over.
 * In the hovered state of an element, the user can rename or delete the layer element.
 */
const LayerElementFileSelector: FC<LayerElementFileSelectorProps> = ({ items, itemEnabledIndex, className, ...props }) => {
  return (
    <div className={className} {...props}>
      {items
        .sort((a, b) => a.priority - b.priority)
        .map((item, index) => {
          return <LayerElementFileTreeItem key={item.id} item={item} enabled={index === itemEnabledIndex} />
        })}
    </div>
  )
}

export default LayerElementFileSelector
