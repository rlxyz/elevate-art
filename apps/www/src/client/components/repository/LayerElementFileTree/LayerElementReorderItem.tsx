import { SelectorIcon } from '@heroicons/react/outline'
import { LayerElement } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import clsx from 'clsx'
import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import { FC } from 'react'
import { useRaisedShadow } from '../../../hooks/utils/useRaisedShadow'

export interface Props {
  repositoryId: string
  item: LayerElement
}

export type ReorderItemProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

export const LayerElementReorderItem: FC<ReorderItemProps> = ({ repositoryId, item, className, ...props }) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      id={item.toString()}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      className={clsx(
        className,
        'bg-lightGray/40 relative flex w-full items-center border border-mediumGrey rounded-[5px] px-4 py-2 cursor-move'
      )}
      onPointerDown={(e) => {
        e.preventDefault()
        dragControls.start(e)
      }}
    >
      <SelectorIcon className='absolute w-3 h-3' />
      <span className='mx-7 w-full flex items-center text-xs whitespace-nowrap overflow-hidden' {...props}>
        {item.name}
      </span>
    </Reorder.Item>
  )
}
