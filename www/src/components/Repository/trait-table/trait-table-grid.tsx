import { TraitElement } from '@prisma/client'
import { truncate } from '@utils/format'
import { getImageForTrait } from '@utils/image'
import { sumBy } from '@utils/object-utils'
import { timeAgo } from '@utils/time'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  traitElements: TraitElement[]
  repositoryId: string
}

export type TraitElementGridProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

/**
 * This Functional Component maintains all the logic related to the TraitElementGrid.
 * It displays the TraitElement images and trait rarity in a grid.
 */
const TraitElementGrid: FC<TraitElementGridProps> = ({ traitElements, repositoryId, className }) => {
  return (
    <div className={clsx(className, 'grid grid-cols-5 gap-3')}>
      {traitElements.map((trait: TraitElement) => {
        return (
          <div key={trait.id} className='w-auto h-auto flex-col border border-mediumGrey rounded-[5px] shadow-md'>
            <div className='h-[10rem] w-auto overflow-hidden flex items-center border-b border-mediumGrey'>
              <img
                loading='lazy'
                className='w-auto h-auto border-t border-b border-mediumGrey object-contain'
                src={getImageForTrait({
                  r: repositoryId,
                  l: trait.layerElementId,
                  t: trait.id,
                })}
              />
            </div>
            <div className='px-1 py-2 flex flex-col space-y-1'>
              <span className='text-xs font-semibold overflow-hidden w-full'>{truncate(trait.name)}</span>
              <div className='flex flex-col text-[0.6rem]'>
                <span className='font-semibold overflow-hidden w-full'>
                  {((trait.weight / sumBy(traitElements, (x) => x.weight)) * 100).toFixed(3)}%
                </span>
                <span className='text-darkGrey overflow-hidden w-full'>Update {timeAgo(trait.updatedAt)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TraitElementGrid
