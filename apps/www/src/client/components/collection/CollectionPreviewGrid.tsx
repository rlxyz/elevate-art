import { Dialog, Transition } from '@headlessui/react'
import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import { useQueryLayerElementFindAll } from '@hooks/trpc/layerElement/useQueryLayerElementFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { Fragment, useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { PreviewImageCardStandalone, PreviewImageCardWithChildren } from './CollectionPreviewImage'

const DynamicCollectionPreviewGridFilterLabels = dynamic(() => import('./CollectionPreviewGridFilterLabels'), { ssr: false })

const InfiniteScrollGridLoading = () => {
  return (
    <>
      {Array.from(Array(25).keys()).map((item, index) => {
        return (
          <div key={`${item}-${index}`} className='col-span-1'>
            <div className={clsx('animate-pulse bg-mediumGrey bg-opacity-50', 'rounded-[5px] relative cursor-pointer shadow-sm')}>
              <div className='pb-[100%]' />
              <div className='pl-2 flex flex-col items-center space-y-1 w-full py-2' />
            </div>
          </div>
        )
      })}
    </>
  )
}

const InfiniteScrollGridItems = ({ length }: { length: number }) => {
  const [selectedToken, setSelectedToken] = useState<number | null>(null)
  const { all: layers } = useQueryLayerElementFindAll()
  const { current: collection } = useQueryCollectionFindAll()
  const { current } = useQueryRepositoryFindByName()
  const { tokens, tokenRanking, repositoryId } = useRepositoryStore((state) => {
    return {
      tokenRanking: state.tokenRanking,
      tokens: state.tokens,
      repositoryId: state.repositoryId,
    }
  })

  return (
    <div className='py-2 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 overflow-hidden'>
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
                className='flex flex-col rounded-[5px] cursor-pointer h-[40rem] md:h-[30rem] lg:h-[12.5rem] xl:h-[15rem] 2xl:h-[20rem] 3xl:h-[25rem] border border-mediumGrey bg-white shadow-lg overflow-hidden'
                onClick={() => setSelectedToken(item || null)}
              >
                <PreviewImageCardWithChildren canHover id={item} collection={collection} layers={layers}>
                  <div className='px-2 flex flex-col h-full items-center justify-center py-2'>
                    <span className='text-[0.6rem] xl:text-xs font-semibold overflow-hidden w-full whitespace-nowrap'>{`${
                      current?.tokenName || ''
                    } #${item || 0}`}</span>
                    <span className='font-semibold w-full xl:text-[0.6rem] text-[0.5rem]'>
                      <span className='text-darkGrey'>Rank {tokenRanking.findIndex((x) => x.index === item) + 1}</span>
                    </span>
                    <span className='hidden xl:block text-darkGrey w-full xl:text-[0.6rem] text-[0.5rem]'>
                      OpenRarity Score {tokenRanking.find((x) => x.index === item)?.score.toFixed(3)}
                    </span>
                  </div>
                </PreviewImageCardWithChildren>
              </article>
            )
          })}
        </>
      )}
      {selectedToken && collection && layers ? (
        <Transition appear show as={Fragment}>
          <Dialog as='div' className='relative z-10' onClose={() => setSelectedToken(null)}>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-black bg-opacity-50' />
            </Transition.Child>

            <div className='fixed inset-0 overflow-y-auto'>
              <div className='flex items-end sm:items-center justify-center min-h-full text-center'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                  enterTo='opacity-100 translate-y-0 sm:scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                  leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                >
                  <Dialog.Panel className='relative bg-white rounded-[5px] border max-w-lg border-mediumGrey overflow-hidden shadow-xl transform transition-all w-full'>
                    <PreviewImageCardStandalone id={selectedToken} collection={collection} layers={layers} className='h-[50vh]' />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      ) : null}
    </div>
  )
}

export const InfiniteScrollGrid = () => {
  const { current: collection } = useQueryCollectionFindAll()
  const [displayLength, setDisplayLength] = useState<number>(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    reset()
    fetch()
  }, [collection?.id])

  const fetch = () => {
    setDisplayLength((prev) => prev + 25)
  }

  const reset = () => {
    setDisplayLength(0)
    setHasMore(true)
  }

  const fetchMoreData = () => {
    if (!collection) return
    if (displayLength + 25 > collection?.totalSupply) {
      setHasMore(false)
      return
    }
    return fetch()
  }

  return (
    <>
      <span
        className={clsx(!collection && 'animate-pulse rounded-[5px] bg-mediumGrey bg-opacity-50', 'lg:text-xs text-[0.6rem] text-darkGrey')}
      >
        <span className={clsx(!collection && 'invisible')}>{`${collection?.generations || 0} generations`}</span>
      </span>
      <div className='min-h-6 space-x-2 flex items-center max-w-full'>
        <div className='space-x-3 flex items-center'>
          <DynamicCollectionPreviewGridFilterLabels />
        </div>
      </div>
      <InfiniteScrollComponent.default
        dataLength={displayLength}
        next={() => {
          fetchMoreData()
        }}
        hasMore={hasMore}
        loader={<></>}
      >
        <InfiniteScrollGridItems length={displayLength} />
      </InfiniteScrollComponent.default>
    </>
  )
}

const Index = () => {
  const { current: collection } = useQueryCollectionFindAll()
  return (
    <main className='space-y-1'>
      <div className='flex flex-col'>
        <div className='col-span-6 font-plus-jakarta-sans space-y-1'>
          <div className='flex space-x-2'>
            <h1
              className={clsx(
                !collection && 'animate-pulse flex flex-row rounded-[5px] bg-mediumGrey bg-opacity-50 w-2/6',
                'lg:text-2xl text-lg font-bold text-black'
              )}
            >
              <span className={clsx(!collection && 'invisible')}>Generate your Collection</span>
            </h1>
          </div>
          <p
            className={clsx(
              !collection && 'animate-pulse rounded-[5px] bg-mediumGrey bg-opacity-50 h-full',
              'lg:text-sm text-xs text-darkGrey w-1/2'
            )}
          >
            <span className={clsx(!collection && 'invisible')}>Create different token sets before finalising the collection</span>
          </p>
        </div>
      </div>
      <InfiniteScrollGrid />
    </main>
  )
}

export default Index
