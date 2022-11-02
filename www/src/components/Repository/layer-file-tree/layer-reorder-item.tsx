import { Link } from '@components/Layout/Link'
import { DotsHorizontalIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import router from 'next/router'
import { FC } from 'react'
import { CollectionNavigationEnum } from 'src/types/enums'
import { useRaisedShadow } from './layer-reorder-item-shadow'

interface Props {
  rounded: boolean
  item: string
  name: string
  enabled: boolean
  canReorder: boolean
}

export type ModalProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * This component allows the end user to reorder items by dragging the ReorderItem up/down to it's desired location
 *
 * @todo rework the Link component being used here
 */
export const ReorderItem: FC<ModalProps> = ({ item, name, enabled, canReorder, rounded, className, ...props }) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  return (
    <Reorder.Item value={item} id={item.toString()} style={{ boxShadow, y }} dragListener={false} dragControls={dragControls}>
      <Link
        href={`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}/${name}`}
        enabled={enabled}
        disabled={canReorder}
        hover
        rounded={rounded}
      >
        <div className={clsx(className, 'flex justify-between w-full')} {...props}>
          <span className='px-5 flex flex-row items-center justify-between text-xs w-full overflow-hidden whitespace-nowrap'>
            {name}
          </span>
          {canReorder && (
            <DotsHorizontalIcon
              className='mr-2 w-4 h-4'
              onPointerDown={(e) => {
                e.preventDefault()
                dragControls.start(e)
              }}
            />
          )}
        </div>
      </Link>
    </Reorder.Item>
  )
}
