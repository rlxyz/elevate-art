import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { truncate } from '@utils/format'
import { getImageForTrait } from '@utils/image'
import { timeAgo } from '@utils/time'
import { calculateSumArray } from './RepositoryRarityTable'

const LayerGridView = ({ traitElements }: { traitElements: TraitElement[] | undefined }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return (
    <div className='grid grid-cols-5 gap-3'>
      {!traitElements?.length ? (
        // <LayerGridLoading />
        <></>
      ) : (
        traitElements
          ?.sort((a, b) => a.weight - b.weight)
          .map((trait: TraitElement) => {
            return (
              <div key={trait.id} className='relative flex-col border border-border rounded-[5px] shadow-lg'>
                <div className='py-4 overflow-hidden'>
                  <img
                    className='relative w-full h-auto border-t border-b border-border'
                    src={getImageForTrait({
                      r: repositoryId,
                      l: trait.layerElementId,
                      t: trait.id,
                    })}
                  />
                </div>
                <div className='px-1 flex flex-col space-y-1 mb-3'>
                  <span className='text-xs font-semibold overflow-hidden w-full'>{truncate(trait.name)}</span>
                  <div className='flex flex-col text-[0.6rem]'>
                    <span className='font-semibold overflow-hidden w-full'>
                      {((trait.weight / calculateSumArray(traitElements)) * 100).toFixed(3)}%
                    </span>
                    <span className='text-accents_5 overflow-hidden w-full'>Update {timeAgo(trait.updatedAt)}</span>
                  </div>
                </div>
              </div>
            )
          })
      )}
    </div>
  )
}

export default LayerGridView
