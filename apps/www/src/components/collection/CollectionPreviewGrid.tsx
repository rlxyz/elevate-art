import { Dialog, Transition } from "@headlessui/react";
import useRepositoryStore from "@hooks/store/useRepositoryStore";
import { useQueryCollectionFindAll } from "@hooks/trpc/collection/useQueryCollectionFindAll";
import { useQueryLayerElementFindAll } from "@hooks/trpc/layerElement/useQueryLayerElementFindAll";
import { useQueryRepositoryFindByName } from "@hooks/trpc/repository/useQueryRepositoryFindByName";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CollectionPreviewGridFilterLabels from "./CollectionPreviewGridFilterLabels";
import { PreviewImageCardStandalone, PreviewImageCardWithChildren } from "./CollectionPreviewImage";

const InfiniteScrollGridLoading = () => {
  return (
    <>
      {Array.from(Array(25).keys()).map((item, index) => {
        return (
          <div key={`${item}-${index}`} className="col-span-1">
            <div className={clsx("animate-pulse bg-accents_7 bg-opacity-50", "relative cursor-pointer rounded-[5px] shadow-sm")}>
              <div className="pb-[100%]" />
              <div className="flex w-full flex-col items-center space-y-1 py-2 pl-2" />
            </div>
          </div>
        );
      })}
    </>
  );
};

const InfiniteScrollGridItems = ({ length }: { length: number }) => {
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const { all: layers } = useQueryLayerElementFindAll();
  const { current: collection } = useQueryCollectionFindAll();
  const { current } = useQueryRepositoryFindByName();
  const { tokens, tokenRanking, repositoryId } = useRepositoryStore((state) => {
    return {
      tokenRanking: state.tokenRanking,
      tokens: state.tokens,
      repositoryId: state.repositoryId,
    };
  });

  return (
    <div className="grid grid-cols-1 gap-6 overflow-hidden py-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {!collection || !layers ? (
        <>
          <InfiniteScrollGridLoading />
        </>
      ) : (
        <>
          {tokens.slice(0, length).map((item, index) => {
            return (
              <article
                key={`${item}-${index}`}
                className="border-mediumGrey bg-white flex h-[40rem] cursor-pointer flex-col rounded-[5px] border shadow-lg md:h-[30rem] lg:h-[12.5rem] xl:h-[15rem] 2xl:h-[20rem] 3xl:h-[25rem]"
                onClick={() => setSelectedToken(item || null)}
              >
                <PreviewImageCardWithChildren canHover id={item} collection={collection} layers={layers}>
                  <div className="flex h-full flex-col items-center justify-center px-2 py-2">
                    <span className="w-full overflow-hidden whitespace-nowrap text-[0.6rem] font-semibold xl:text-xs">{`${
                      current?.tokenName || ""
                    } #${item || 0}`}</span>
                    <span className="w-full text-[0.5rem] font-semibold xl:text-[0.6rem]">
                      <span className="text-darkGrey">Rank {tokenRanking.findIndex((x) => x.index === item) + 1}</span>
                    </span>
                    <span className="text-darkGrey hidden w-full text-[0.5rem] xl:block xl:text-[0.6rem]">
                      OpenRarity Score {tokenRanking.find((x) => x.index === item)?.score.toFixed(3)}
                    </span>
                  </div>
                </PreviewImageCardWithChildren>
              </article>
            );
          })}
        </>
      )}
      {selectedToken && collection && layers ? (
        <Transition appear show as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setSelectedToken(null)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-foreground bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center text-center sm:items-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="bg-white border-lightGray relative w-1/2 max-w-lg transform overflow-hidden rounded-[5px] border shadow-xl transition-all">
                    <PreviewImageCardStandalone id={selectedToken} collection={collection} layers={layers} className="h-[50vh]" />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      ) : null}
    </div>
  );
};

export const InfiniteScrollGrid = () => {
  const { current: collection } = useQueryCollectionFindAll();
  const [displayLength, setDisplayLength] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    reset();
    fetch();
  }, [collection?.id]);

  const fetch = () => {
    setDisplayLength((prev) => prev + 25);
  };

  const reset = () => {
    setDisplayLength(0);
    setHasMore(true);
  };

  const fetchMoreData = () => {
    if (!collection) return;
    if (displayLength + 25 > collection?.totalSupply) {
      setHasMore(false);
      return;
    }
    return fetch();
  };

  return (
    <>
      <span
        className={clsx(!collection && "bg-mediumGrey animate-pulse rounded-[5px] bg-opacity-50", "text-darkGrey text-[0.6rem] lg:text-xs")}
      >
        <span className={clsx(!collection && "invisible")}>{`${collection?.generations || 0} generations`}</span>
      </span>
      <div className="min-h-6 flex max-w-full items-center space-x-2">
        <div className="flex items-center space-x-3">
          <CollectionPreviewGridFilterLabels />
        </div>
      </div>
      <InfiniteScroll
        dataLength={displayLength}
        next={() => {
          fetchMoreData();
        }}
        hasMore={hasMore}
        loader={<></>}
      >
        <InfiniteScrollGridItems length={displayLength} />
      </InfiniteScroll>
    </>
  );
};

const Index = () => {
  const { current: collection } = useQueryCollectionFindAll();
  return (
    <main className="space-y-1">
      <div className="flex flex-col">
        <div className="col-span-6 space-y-1 font-plus-jakarta-sans">
          <div className="flex space-x-2">
            <h1
              className={clsx(
                !collection && "bg-mediumGrey flex w-2/6 animate-pulse flex-row rounded-[5px] bg-opacity-50",
                "text-black text-lg font-bold lg:text-2xl",
              )}
            >
              <span className={clsx(!collection && "invisible")}>Generate your Collection</span>
            </h1>
          </div>
          <p
            className={clsx(
              !collection && "bg-mediumGrey h-full animate-pulse rounded-[5px] bg-opacity-50",
              "text-darkGrey w-1/2 text-xs lg:text-sm",
            )}
          >
            <span className={clsx(!collection && "invisible")}>Create different token sets before finalising the collection</span>
          </p>
        </div>
      </div>
      <InfiniteScrollGrid />
    </main>
  );
};

export default Index;
