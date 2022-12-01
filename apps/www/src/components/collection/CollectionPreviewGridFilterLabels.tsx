import clsx from "clsx";
import useRepositoryStore from "src/hooks/store/useRepositoryStore";
import { useQueryCollectionFindAll } from "src/hooks/trpc/collection/useQueryCollectionFindAll";

const CollectionPreviewGridFilterLabels = () => {
  const { tokens, traitFilters, rarityFilter } = useRepositoryStore((state) => {
    return {
      tokens: state.tokens,
      traitFilters: state.traitFilters,
      rarityFilter: state.rarityFilter,
    };
  });
  const { current: collection } = useQueryCollectionFindAll();
  return (
    <>
      <div
        className={clsx(!collection && "bg-mediumGrey h-full animate-pulse rounded-[5px] bg-opacity-50", "text-ellipsis whitespace-nowrap")}
      >
        <div className={clsx(!collection && "invisible")}>
          {rarityFilter !== "All" ? (
            <span className="text-xs text-foreground">
              {`${tokens.length} results `}
              {traitFilters.length > 0 ? (
                <span>
                  for
                  <span className="text-success"> {rarityFilter}</span> with filters
                </span>
              ) : (
                ""
              )}
            </span>
          ) : (
            <span className="text-black text-[0.6rem] lg:text-xs">{`${tokens.length} results`}</span>
          )}
        </div>
      </div>
      <div className={clsx(!collection && "invisible", "ml-2 max-w-full space-x-2 space-y-1")}>
        {traitFilters.map(({ layer, trait }, index) => (
          <span
            key={index}
            className="bg-lightGray border-mediumGrey text-black inline-flex items-center rounded-full border bg-opacity-40 py-1 px-2 text-[0.6rem] font-medium lg:text-xs"
          >
            <div>
              <span className="mr-1 text-[0.6rem] text-accents_5">{layer.name}</span> {trait.name}
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
  );
};
export default CollectionPreviewGridFilterLabels;
