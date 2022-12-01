import clsx from 'clsx'
import useRepositoryStore from 'src/hooks/store/useRepositoryStore'
import { useQueryCollectionFindAll } from 'src/hooks/trpc/collection/useQueryCollectionFindAll'

const CollectionPreviewGridFilterLabels = () => {
  const { tokens, traitFilters, rarityFilter } = useRepositoryStore((state) => {
    return {
      tokens: state.tokens,
      traitFilters: state.traitFilters,
      rarityFilter: state.rarityFilter,
    }
  })
  const { current: collection } = useQueryCollectionFindAll()
  return (
    <>
      <div
<<<<<<<< HEAD:apps/www/src/components/Collection/CollectionPreviewGridFilterLabels.tsx
        className={clsx(
          !collection && 'animate-pulse rounded-[5px] bg-accents_7 bg-opacity-50 h-full',
          'whitespace-nowrap text-ellipsis'
        )}
========
        className={clsx(!collection && 'animate-pulse rounded-[5px] bg-mediumGrey bg-opacity-50 h-full', 'whitespace-nowrap text-ellipsis')}
>>>>>>>> staging:apps/www/src/client/components/collection/CollectionPreviewGridFilterLabels.tsx
      >
        <div className={clsx(!collection && 'invisible')}>
          {rarityFilter !== 'All' ? (
            <span className='text-xs text-foreground'>
              {`${tokens.length} results `}
              {traitFilters.length > 0 ? (
                <span>
                  for
                  <span className='text-success'> {rarityFilter}</span> with filters
                </span>
              ) : (
                ''
              )}
            </span>
          ) : (
<<<<<<<< HEAD:apps/www/src/components/Collection/CollectionPreviewGridFilterLabels.tsx
            <span className='text-xs text-foreground'>{`${tokens.length} results`}</span>
========
            <span className='lg:text-xs text-[0.6rem] text-black'>{`${tokens.length} results`}</span>
>>>>>>>> staging:apps/www/src/client/components/collection/CollectionPreviewGridFilterLabels.tsx
          )}
        </div>
      </div>
      <div className={clsx(!collection && 'invisible', 'space-x-2 ml-2 space-y-1 max-w-full')}>
        {traitFilters.map(({ layer, trait }, index) => (
          <span
            key={index}
<<<<<<<< HEAD:apps/www/src/components/Collection/CollectionPreviewGridFilterLabels.tsx
            className='inline-flex items-center rounded-full bg-accents_8 bg-opacity-40 border border-border py-1 px-2 text-xs font-medium text-foreground'
========
            className='inline-flex items-center rounded-full bg-lightGray bg-opacity-40 border border-mediumGrey py-1 px-2 lg:text-xs text-[0.6rem] font-medium text-black'
>>>>>>>> staging:apps/www/src/client/components/collection/CollectionPreviewGridFilterLabels.tsx
          >
            <div>
              <span className='text-accents_5 mr-1 text-[0.6rem]'>{layer.name}</span> {trait.name}
            </div>
            {/* <button
                  type='button'
                  className='ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400'
                  onClick={() => console.log(trait.name)}
                >
                  <XIcon className='w-3 h-3 text-accents_5' />
                </button> */}
          </span>
        ))}
      </div>
    </>
  )
}
export default CollectionPreviewGridFilterLabels
