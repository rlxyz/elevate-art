import { AdvancedImage } from '@cloudinary/react'
import { XIcon } from '@heroicons/react/outline'
import { useQueryRenderSingleToken } from '@hooks/query/useQueryRenderSingleToken'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { Collection } from '@prisma/client'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'

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
  const { images } = useQueryRenderSingleToken({ id, collection, layers, repositoryId })
  if (!images) return null
  return (
    <>
      {images.map((image) => {
        return (
          <AdvancedImage
            key={image.toURL()}
            priority
            layout='fill'
            className={clsx('absolute rounded-[5px] object-cover')}
            cldImg={image}
          />
        )
      })}
    </>
  )
}

const InfiniteScrollGridItems = ({ length }: { length: number }) => {
  const [selectedToken, setSelectedToken] = useState<number | null>(null)
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const { current: collection } = useQueryRepositoryCollection()
  const { tokens, repositoryId } = useRepositoryStore((state) => {
    return {
      tokens: state.tokens,
      repositoryId: state.repositoryId,
    }
  })
  if (!collection || !layers || isLoading) return null
  return (
    <div className='grid grid-cols-5 gap-6 overflow-hidden'>
      {tokens.slice(0, length).map((item, index) => {
        return (
          <div key={`${item}-${index}`} className='col-span-1'>
            <div
              className='relative flex flex-col items-center justify-center cursor-pointer w-full h-full'
              onClick={() => setSelectedToken(item || null)}
            >
              <PreviewImage id={item} collection={collection} layers={layers} repositoryId={repositoryId} />
            </div>
            <span className={'flex text-xs items-center justify-center w-full overflow-hidden whitespace-nowrap text-ellipsis'}>
              {`#${item || 0}`}
            </span>
            <div className='pb-[100%]' />
          </div>
        )
      })}
      {/* {tokensOnDisplay.map((index: number) => {
        return (
          <RenderIfVisible key={tokens[index]} rootElementClass='col-span-1'>
            <div
              className='relative flex flex-col items-center justify-center cursor-pointer'
              onClick={() => setSelectedToken(tokens[index] || null)}
            >
              {layers && collection ? (
                <>
                  <div className='pb-[100%] border border-mediumGrey pl-[100%] shadow-lg rounded-[5px]' />
                  <PreviewImage
                    tokens={createToken({
                      id: Number(tokens[index]),
                      name: collection.name,
                      generation: collection.generations,
                      layers,
                    })}
                    cld={cld}
                    repositoryId={repositoryId}
                  />
                </>
              ) : (
                <div className='border animate-pulse shadow-md bg-lightGray border-mediumGrey rounded-[5px] pb-[100%] w-full' />
              )}
            </div>
            <span
              className={clsx(
                collection && layers ? '' : 'animate-pulse font-semibold',
                'flex text-xs py-1 items-center justify-center w-full overflow-hidden whitespace-nowrap text-ellipsis'
              )}
            >
              {collection && layers ? `#${tokens[index] || 0}` : '...'}
            </span>
          </RenderIfVisible>
        )
      })} */}
      {/* {selectedToken && collection && layers ? (
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
                    <div className='space-y-4'>
                      <div className='pb-[100%] blocks' />
                      {createToken({
                        id: Number(selectedToken),
                        name: collection.name,
                        generation: collection.generations,
                        layers,
                      }).map((item) => {
                        return (
                          <Image
                            key={item.id}
                            priority
                            layout='fill'
                            className='rounded-[5px] object-cover'
                            src={cld
                              .image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${item.layerElementId}/${item.id}.png`)
                              .toURL()}
                          />
                        )
                      })}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      ) : null} */}
    </div>
  )
}

export const InfiniteScrollGrid = () => {
  const { current: collection } = useQueryRepositoryCollection()
  const [displayLength, setDisplayLength] = useState<number>(0)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { tokens, tokenRanking, traitFilters, rarityFilter } = useRepositoryStore((state) => {
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
      <span className='text-xs text-darkGrey'>{`${collection?.generations} generations`}</span>
      <div className='min-h-6 space-x-2 flex items-center max-w-full'>
        <div className='space-x-3 flex items-center'>
          <div className='whitespace-nowrap text-ellipsis'>
            {rarityFilter !== 'All' ? (
              <span className='text-xs text-black'>
                {`${tokens.length} results `}
                {traitFilters.length > 0 ? (
                  <span>
                    for
                    <span className='text-blueHighlight underline'> {rarityFilter}</span> with filters
                  </span>
                ) : (
                  ''
                )}
              </span>
            ) : (
              <span className='text-xs text-black'>{`${tokens.length} results`}</span>
            )}
          </div>
          <div className='space-x-2 ml-2 space-y-1 max-w-full'>
            {traitFilters.map(({ layer, trait }, index) => (
              <span
                key={index}
                className='inline-flex items-center rounded-full bg-lightGray bg-opacity-40 border border-mediumGrey py-1 pl-2.5 pr-1 text-xs font-medium text-black'
              >
                {trait.name}
                <button
                  type='button'
                  className='ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400'
                >
                  <XIcon className='w-3 h-3 text-darkGrey' />
                </button>
              </span>
            ))}
          </div>
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
  return (
    <main className='space-y-3'>
      <div className='flex flex-col'>
        <div className='col-span-6 font-plus-jakarta-sans space-y-1'>
          <h1 className={clsx('text-2xl font-bold text-black')}>Generate your Collection</h1>
          <p className={clsx('text-sm text-darkGrey')}>Create different token sets before finalising the collection</p>
        </div>
      </div>
      <div>
        <InfiniteScrollGrid />
      </div>
    </main>
  )
}

export default Index
