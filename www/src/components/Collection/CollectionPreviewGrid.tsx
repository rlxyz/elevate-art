import { Dialog, Popover, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { useQueryRenderSingleToken } from '@hooks/query/useQueryRenderSingleToken'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { Collection } from '@prisma/client'
import { truncate } from '@utils/format'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import RenderIfVisible from 'react-render-if-visible'
const DynamicCollectionPreviewGridFilterLabels = dynamic(() => import('./CollectionPreviewGridFilterLabels'), { ssr: false })

const PreviewImage = ({
  id,
  collection,
  layers,
  repositoryId,
  children,
}: {
  id: number
  collection: Collection
  repositoryId: string
  layers: LayerElements
  children: ReactNode
}) => {
  const { images } = useQueryRenderSingleToken({ tokenId: id, collection, layers, repositoryId })
  const [hasLoaded, setHasLoaded] = useState(false)
  return (
    <div className={clsx('relative rounded-[5px]')}>
      <div className='border border-mediumGrey'>
        {images.map((image) => {
          return <img key={image.toURL()} className={clsx('absolute', 'rounded-[5px] w-full h-auto')} src={image.toURL()} />
        })}
        <img className='invisible relative w-full h-auto' onLoad={() => setHasLoaded(true)} src={images[0]?.toURL()} />
      </div>
      {hasLoaded && children}
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

  return (
    <div className='py-2 grid grid-cols-4 gap-y-2 gap-x-6 overflow-hidden'>
      {!collection || !layers ? (
        <>
          <InfiniteScrollGridLoading />
        </>
      ) : (
        <>
          {tokens.slice(0, length).map((item, index) => {
            return (
              <RenderIfVisible key={`${item}-${index}`}>
                <div className='flex flex-col rounded-[5px] cursor-pointer' onClick={() => setSelectedToken(item || null)}>
                  <PreviewImage id={item} collection={collection} layers={layers} repositoryId={repositoryId}>
                    <div
                      className={
                        'whitespace-nowrap overflow-hidden text-ellipsis flex flex-col items-center space-y-1 w-full py-2'
                      }
                    >
                      <span className='text-xs'>{truncate(`${current?.tokenName} #${item || 0}`)}</span>
                    </div>
                  </PreviewImage>
                </div>
              </RenderIfVisible>
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
                  <Dialog.Panel className='relative bg-white rounded-[5px] border border-lightGray overflow-hidden shadow-xl transform transition-all w-1/2'>
                    <PreviewImage id={selectedToken} collection={collection} layers={layers} repositoryId={repositoryId}>
                      <></>
                    </PreviewImage>
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
          <div className='flex space-x-2'>
            <h1
              className={clsx(
                !collection && 'animate-pulse flex flex-row rounded-[5px] bg-mediumGrey bg-opacity-50 w-2/6',
                'text-2xl font-bold text-black'
              )}
            >
              <span className={clsx(!collection && 'invisible')}>Generate your Collection</span>
            </h1>
            {collection && (
              <Popover>
                <Popover.Button as={InformationCircleIcon} className='text-darkGrey w-3 h-3 bg-lightGray' />
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-200'
                  enterFrom='opacity-0 translate-y-1'
                  enterTo='opacity-100 translate-y-0'
                  leave='transition ease-in duration-150'
                  leaveFrom='opacity-100 translate-y-0'
                  leaveTo='opacity-0 translate-y-1'
                >
                  <Popover.Panel className='absolute w-[200px] bg-black z-10 -translate-x-1/2 transform rounded-[5px]'>
                    <div className='p-2 shadow-lg'>
                      <p className='text-[0.65rem] text-white font-normal'>
                        {'This collection is sorted by rarity ranking based on OpenRarity.'}
                      </p>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            )}
          </div>
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
