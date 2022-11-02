import { LayerElement } from '@prisma/client'
import { truncate } from '@utils/format'
import clsx from 'clsx'
import { AnimatePresence, Reorder } from 'framer-motion'
import { FC } from 'react'
import { ReorderItem } from './layer-reorder-item'

interface Props {
  items: LayerElement[]
  itemEnabledIndex: number
  onReorder: (newOrder: any[]) => void
  isReorderable: boolean
  layers: LayerElement[]
}

export type LayerElementFileSelectorProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

const LayerElementFileSelector: FC<LayerElementFileSelectorProps> = ({
  items,
  onReorder,
  isReorderable,
  itemEnabledIndex,
  className,
  layers,
  ...props
}) => {
  return (
    <div className={clsx(className, 'border border-mediumGrey rounded-[5px] max-h-[calc(100vh-17.5rem)]')} {...props}>
      <AnimatePresence>
        <Reorder.Group axis='y' layoutScroll onReorder={onReorder} values={items}>
          {items.map((item, index) => {
            return (
              <ReorderItem
                rounded={index === 0 || index === items.length - 1 ? true : false}
                canReorder={isReorderable}
                key={item.id}
                name={truncate(item.name)}
                item={item}
                enabled={index === itemEnabledIndex}
              />
            )
          })}
        </Reorder.Group>
      </AnimatePresence>
    </div>
  )
}

export default LayerElementFileSelector
