import { useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { FilterByRarity, FilterByTrait } from '../CollectionHelpers/CollectionFilters'

const PreviewFilter = () => {
  const { data: layers, isLoading } = useQueryRepositoryLayer()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return (
    <>
      {!isLoading && layers && repositoryId && (
        <div className='border border-mediumGrey rounded-[5px] p-1 space-y-1'>
          <>
            <FilterByRarity />
            <div className='px-3'>
              <div className='bg-mediumGrey h-[0.25px] w-full' />
            </div>
            <FilterByTrait layers={layers} />
          </>
        </div>
      )}
    </>
  )
}

export default PreviewFilter
