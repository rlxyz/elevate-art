import { LayerElement } from '@prisma/client'
import clsx from 'clsx'
import { AnimatePresence, Reorder } from 'framer-motion'
import { FC } from 'react'
import { ReorderItem } from './layer-reorder-item'

interface Props {
  items: LayerElement[]
  itemEnabledIndex: number
  onReorder: (newOrder: any[]) => void
  isReorderable: boolean
}

export type LayerElementFileSelectorProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * This is the core LayerElementFileSelector component, it allows users to be routed
 * to a specific layer element by clicking on it
 *
 * It maintains two states, one for the layer element that is currently being hovered over.
 * In the hovered state of an element, the user can rename or delete the layer element.
 */
const LayerElementFileSelector: FC<LayerElementFileSelectorProps> = ({
  items,
  onReorder,
  isReorderable,
  itemEnabledIndex,
  className,
}) => {
  return (
    <AnimatePresence>
      <Reorder.Group
        axis='y'
        layoutScroll
        onReorder={onReorder}
        values={items}
        className={clsx(className, 'max-h-[calc(100vh-17.5rem)] no-scrollbar w-full')}
      >
        {items.map((item, index) => {
          return <ReorderItem isReorderable={isReorderable} key={item.id} item={item} enabled={index === itemEnabledIndex} />
        })}
      </Reorder.Group>
    </AnimatePresence>
  )
}

export default LayerElementFileSelector
