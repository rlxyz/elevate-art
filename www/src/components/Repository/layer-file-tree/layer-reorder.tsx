import { LayerElement } from '@prisma/client'
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

const LayerElementFileSelector: FC<LayerElementFileSelectorProps> = ({
  items,
  onReorder,
  isReorderable,
  itemEnabledIndex,
  className,
  ...props
}) => {
  return (
    <AnimatePresence>
      <Reorder.Group axis='y' layoutScroll onReorder={onReorder} values={items} className={className}>
        {items.map((item, index) => {
          return <ReorderItem isReorderable={isReorderable} key={item.id} item={item} enabled={index === itemEnabledIndex} />
        })}
      </Reorder.Group>
    </AnimatePresence>
  )
}

export default LayerElementFileSelector
