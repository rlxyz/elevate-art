import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import clsx from 'clsx'

const CollectionPreviewGridFilterLabels = () => {
  const { tokens, traitFilters, rarityFilter } = useRepositoryStore((state) => {
    return {
      tokens: state.tokens,
      traitFilters: state.traitFilters,
      rarityFilter: state.rarityFilter,
    }
  })
  const { current: collection } = useQueryRepositoryCollection()
  return (
    <>
      <div
        className={clsx(!collection && 'animate-pulse rounded-[5px] bg-mediumGrey bg-opacity-50 h-full', 'whitespace-nowrap text-ellipsis')}
      >
        <div className={clsx(!collection && 'invisible')}>
          {rarityFilter !== 'All' ? (
            <span className='text-xs text-black'>
              {`${tokens.length} results `}
              {traitFilters.length > 0 ? (
                <span>
                  for
                  <span className='text-blueHighlight'> {rarityFilter}</span> with filters
                </span>
              ) : (
                ''
              )}
            </span>
          ) : (
            <span className='lg:text-xs text-[0.6rem] text-black'>{`${tokens.length} results`}</span>
          )}
        </div>
      </div>
      <div className={clsx(!collection && 'invisible', 'space-x-2 ml-2 space-y-1 max-w-full')}>
        {traitFilters.map(({ layer, trait }, index) => (
          <span
            key={index}
            className='inline-flex items-center rounded-full bg-lightGray bg-opacity-40 border border-mediumGrey py-1 px-2 lg:text-xs text-[0.6rem] font-medium text-black'
          >
            <div>
              <span className='text-darkGrey mr-1 text-[0.6rem]'>{layer.name}</span> {trait.name}
            </div>
            {/* <button
                  type='button'
                  className='ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400'
                  onClick={() => console.log(trait.name)}
                >
                  <XIcon className='w-3 h-3 text-darkGrey' />
                </button> */}
          </span>
        ))}
      </div>
    </>
  )
}
export default CollectionPreviewGridFilterLabels
