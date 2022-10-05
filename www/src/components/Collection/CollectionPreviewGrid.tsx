import { Dialog, Transition } from '@headlessui/react'
import { useQueryRenderSingleToken } from '@hooks/query/useQueryRenderSingleToken'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { Collection } from '@prisma/client'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { Fragment, useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'

const DynamicCollectionPreviewGridFilterLabels = dynamic(() => import('./CollectionPreviewGridFilterLabels'), { ssr: false })

const PreviewImage = ({
  id,
  collection,
  layers,
  repositoryId,
}: {
  id: number
  collection: Collection
  repositoryId: string
  layers: LayerElements
}) => {
  const { images } = useQueryRenderSingleToken({ tokenId: id, collection, layers, repositoryId })
  if (!images) return null
  return (
    <div className='relative border border-mediumGrey rounded-[5px]'>
      {images.map((image, index) => {
        return (
          <img
            key={image.toURL()}
            className={clsx(index === images.length - 1 ? 'relative' : 'absolute', 'rounded-[5px]')}
            src={image.toURL()}
          />
        )
      })}
    </div>
  )
}

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
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const { current: collection } = useQueryRepositoryCollection()
  const { current } = useQueryRepository()
  const { tokens, repositoryId } = useRepositoryStore((state) => {
    return {
      tokens: state.tokens,
      repositoryId: state.repositoryId,
    }
  })
  // if (!collection || !layers || isLoading) return
  return (
    <div className='py-2 grid grid-cols-4 gap-6 overflow-hidden'>
      {!collection || !layers ? (
        <>
          <InfiniteScrollGridLoading />
        </>
      ) : (
        <>
          {tokens.slice(0, length).map((item, index) => {
            return (
              <div key={`${item}-${index}`} className='col-span-1'>
                <div className='flex flex-col rounded-[5px] cursor-pointer' onClick={() => setSelectedToken(item || null)}>
                  <PreviewImage id={item} collection={collection} layers={layers} repositoryId={repositoryId} />
                  <div className={'flex flex-col items-center space-y-1 w-full py-2'}>
                    <span className='text-xs'>{`${current?.tokenName} #${item || 0}`}</span>
                  </div>
                </div>
              </div>
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
                  <Dialog.Panel className='relative bg-white rounded-[5px] border border-lightGray text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full space-y-6 divide-y divide-lightGray'>
                    <div>
                      <PreviewImage id={selectedToken} collection={collection} layers={layers} repositoryId={repositoryId} />
                      <div className='pb-[100%] blocks' />
                    </div>
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
  const { current: collection } = useQueryRepositoryCollection()
  const [displayLength, setDisplayLength] = useState<number>(0)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { tokens, traitFilters, rarityFilter } = useRepositoryStore((state) => {
    return {
      tokenRanking: state.tokenRanking,
      tokens: state.tokens,
      traitFilters: state.traitFilters,
      rarityFilter: state.rarityFilter,
    }
  })

  useEffect(() => {
    reset()
    fetch('new')
  }, [collection?.id])

  const fetch = (type: 'new' | 'append') => {
    setPage((p) => p + 1)
    setDisplayLength((prev) => prev + 25)
  }

  const reset = () => {
    setPage(0)
    setDisplayLength(0)
    setHasMore(true)
  }

  const fetchMoreData = () => {
    if (!collection) return
    if (displayLength + 25 > collection?.totalSupply) {
      setHasMore(false)
      return
    }
    return fetch('new')
  }

  return (
    <>
      <span
        className={clsx(!collection && 'animate-pulse rounded-[5px] bg-mediumGrey bg-opacity-50', 'text-xs text-darkGrey mb-1')}
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
  const { current: collection } = useQueryRepositoryCollection()
  return (
    <main className='space-y-3'>
      <div className='flex flex-col'>
        <div className='col-span-6 font-plus-jakarta-sans space-y-1'>
          <h1
            className={clsx(
              !collection && 'animate-pulse rounded-[5px] bg-mediumGrey bg-opacity-50 w-2/6',
              'text-2xl font-bold text-black'
            )}
          >
            <span className={clsx(!collection && 'invisible')}>Generate your Collection</span>
          </h1>
          <p
            className={clsx(
              !collection && 'animate-pulse rounded-[5px] bg-mediumGrey bg-opacity-50 h-full',
              'text-sm text-darkGrey w-1/2'
            )}
          >
            <span className={clsx(!collection && 'invisible')}>Create different token sets before finalising the collection</span>
          </p>
        </div>
      </div>
      <div>
        <InfiniteScrollGrid />
      </div>
    </main>
  )
}

export default Index
