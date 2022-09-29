import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { createToken } from '@utils/compiler'
import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import { clientEnv } from 'src/env/schema.mjs'

const InfiniteScrollGridItems = ({
  collection,
  tokensOnDisplay,
  layers,
}: {
  tokensOnDisplay: number[]
  collection: Collection
  layers: (LayerElement & {
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
}) => {
  const tokens = useRepositoryStore((state) => state.tokens)
  const [selectedToken, setSelectedToken] = useState<number | null>(null)
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const cld = createCloudinary()
  if (!tokens || !tokens.length || !collection) return <></>

  return (
    <div className='grid grid-cols-5 gap-y-1 gap-x-6 overflow-hidden'>
      {tokensOnDisplay.map((index: number) => {
        return (
          <div className='col-span-1'>
            <div
              className='relative flex flex-col items-center justify-center'
              onClick={() => setSelectedToken(tokens[index] || null)}
            >
              {createToken({
                id: Number(tokens[index]),
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
              <div className='pb-[100%]' />
            </div>
            <span className='flex text-xs py-1 items-center justify-center w-full overflow-hidden whitespace-nowrap text-ellipsis'>
              {`#${tokens[index] || 0}`}
            </span>
            {/* <RenderIfVisible
            key={`${tokens[index]}-${collection.generations}`}
            rootElementClass='cursor-pointer relative col-span-1 border'
          >
            <div
              className='relative flex flex-col items-center justify-center'
              onClick={() => setSelectedToken(tokens[index] || null)}
            >
              {createToken({
                id: Number(tokens[index]),
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
            <div className='pb-[100%] blocks' />
            <span className='flex text-xs py-1 items-center justify-center w-full overflow-hidden whitespace-nowrap text-ellipsis'>{`#${
              tokens[index] || 0
            }`}</span>
          </RenderIfVisible> */}
          </div>
        )
      })}
      {selectedToken ? (
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

export const InfiniteScrollGrid = ({
  collection,
  layers,
}: {
  collection: Collection
  layers: (LayerElement & {
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
}) => {
  const [tokensOnDisplay, setTokensOnDisplay] = useState<number[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { tokens, traitFilters } = useRepositoryStore((state) => {
    return {
      tokens: state.tokens,
      traitFilters: state.traitFilters,
    }
  })

  const fetch = (start: number) => {
    if (!collection) return
    const startPointIndex = start
    const endPointIndex = start + 1
    const startPoint = startPointIndex * 50
    const endPoint = endPointIndex * 50
    setTokensOnDisplay([...tokensOnDisplay, ...[...Array(endPoint - startPoint)].map((_, i) => i + startPoint)])
    setPage((p) => p + 1)
  }

  const fetchMoreData = (page: number) => {
    if (!collection || page * 50 >= collection.totalSupply) {
      setHasMore(false)
      return
    }
    return fetch(page)
  }

  useEffect(() => {
    fetch(0)
  }, [traitFilters])

  return (
    <>
      <div className='pb-3 space-x-3'>
        <span className='text-xs text-darkGrey'>{tokens.length} results</span>
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
        dataLength={tokensOnDisplay.length}
        next={() => {
          fetchMoreData(page)
        }}
        hasMore={hasMore}
        loader={<></>}
      >
        <InfiniteScrollGridItems
          tokensOnDisplay={tokensOnDisplay.slice(0, tokens.length)}
          layers={layers}
          collection={collection}
        />
      </InfiniteScrollComponent.default>
    </>
  )
}
