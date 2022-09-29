import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useQueryCollection, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { createToken } from '@utils/compiler'
import clsx from 'clsx'
import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import RenderIfVisible from 'react-render-if-visible'
import { clientEnv } from 'src/env/schema.mjs'

const PreviewImage = ({ tokens, cld, repositoryId }: { tokens: TraitElement[]; cld: Cloudinary; repositoryId: string }) => {
  const [loaded, setLoaded] = useState(0)
  return (
    <>
      {tokens.map((item) => {
        return (
          <AdvancedImage
            key={item.id}
            priority
            onLoad={() => {
              setLoaded((prev) => prev + 1)
            }}
            layout='fill'
            className={clsx('absolute rounded-[5px] object-cover')}
            cldImg={cld.image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${item.layerElementId}/${item.id}.png`)}
          />
        )
      })}
    </>
  )
}

const InfiniteScrollGridItems = ({
  name,
  generation,
  collection,
  displayTokens,
  layers,
}: {
  name: string
  generation: number
  displayTokens: number[]
  collection: Collection | null | undefined
  layers:
    | (LayerElement & {
        traitElements: (TraitElement & {
          rulesPrimary: (Rules & {
            primaryTraitElement: TraitElement & { layerElement: LayerElement }
            secondaryTraitElement: TraitElement & { layerElement: LayerElement }
          })[]
          rulesSecondary: (Rules & {
            primaryTraitElement: TraitElement & { layerElement: LayerElement }
            secondaryTraitElement: TraitElement & { layerElement: LayerElement }
          })[]
        })[]
      })[]
    | null
    | undefined
}) => {
  const [selectedToken, setSelectedToken] = useState<number | null>(null)
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const cld = createCloudinary()

  return (
    <div className='grid grid-cols-5 gap-y-2 gap-x-6 overflow-hidden'>
      {displayTokens.map((item) => {
        return (
          <RenderIfVisible key={item} rootElementClass='col-span-1'>
            <div
              className='relative flex flex-col items-center justify-center cursor-pointer'
              onClick={() => setSelectedToken(item || null)}
            >
              {layers && collection ? (
                <>
                  <div className='pb-[100%] border border-mediumGrey pl-[100%] shadow-lg rounded-[5px]' />
                  <PreviewImage
                    tokens={createToken({
                      id: item,
                      name,
                      generation,
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
              {collection && layers ? `#${item || 0}` : '...'}
            </span>
          </RenderIfVisible>
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
      ) : null}
    </div>
  )
}

export const InfiniteScrollGrid = () => {
  const { data: layers } = useQueryRepositoryLayer()
  const { data: collection } = useQueryCollection()
  const [displayLength, setDisplayLength] = useState<number>(0)
  const [currentCollectionName, setCurrentCollectionName] = useState(collection?.name)
  const [currentCollectionGeneration, setCurrentCollectionGeneration] = useState(collection?.generations)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [hasHydrated, setHasHydrated] = useState(true)
  const { tokens, traitFilters, rarityFilter, collectionId } = useRepositoryStore((state) => {
    return {
      tokens: state.tokens,
      traitFilters: state.traitFilters,
      rarityFilter: state.rarityFilter,
      collectionId: state.collectionId,
    }
  })

  const fetch = (type: 'new' | 'append') => {
    setPage((p) => p + 1)
    setDisplayLength((prev) => prev + 25)
    if (type === 'new') setHasHydrated(true)
  }

  const reset = () => {
    setPage(0)
    setDisplayLength(0)
    setCurrentCollectionGeneration(collection?.generations)
    setCurrentCollectionName(collection?.name)
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

  useEffect(() => {
    setHasHydrated(false)
    reset()
    fetch('new')
  }, [collection?.id])

  return (
    <>
      <div className='pb-3 space-x-3'>
        {rarityFilter !== 'All' ? (
          <span className='text-xs text-darkGrey'>
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
          <span className='text-xs text-darkGrey'>{`${tokens.length} results`}</span>
        )}
        {traitFilters.map(({ layer, trait }, index) => (
          <span
            key={index}
            className='inline-flex items-center rounded-full bg-lightGray border border-mediumGrey py-1 pl-2.5 pr-1 text-xs font-medium'
          >
            {trait.name}
            <button
              type='button'
              className='ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none'
              onClick={() => console.log('todo remove filter')}
            >
              <XIcon className='w-3 h-3 text-darkGrey' />
            </button>
          </span>
        ))}
      </div>
      <InfiniteScrollComponent.default
        dataLength={displayLength}
        next={() => {
          fetchMoreData()
        }}
        hasMore={hasMore}
        loader={<></>}
      >
        {hasHydrated && (
          <InfiniteScrollGridItems
            generation={currentCollectionGeneration || 0}
            name={currentCollectionName || ''}
            displayTokens={tokens.slice(0, displayLength)}
            layers={layers}
            collection={collection}
          />
        )}
      </InfiniteScrollComponent.default>
    </>
  )
}
