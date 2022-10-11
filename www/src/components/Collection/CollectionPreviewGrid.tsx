import { Dialog, Transition } from '@headlessui/react'
import { useQueryRepository } from '@hooks/query/useQueryRepository'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import * as v from '@utils/compiler'
import { getImageForTrait } from '@utils/image'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'

const DynamicCollectionPreviewGridFilterLabels = dynamic(() => import('./CollectionPreviewGridFilterLabels'), { ssr: false })

const PreviewImage = ({
  id,
  collection,
  layers,
  repositoryId,
  children,
  canHover = false,
}: {
  id: number
  collection: Collection
  repositoryId: string
  layers: (LayerElement & { traitElements: (TraitElement & { rulesPrimary: Rules[]; rulesSecondary: Rules[] })[] })[]
  children: ReactNode
  canHover?: boolean
}) => {
  const elements = v.one(
    v.parseLayer(
      layers.map((l) => ({
        ...l,
        traits: l.traitElements.map((t) => ({
          ...t,
          rules: [...t.rulesPrimary, ...t.rulesSecondary].map(
            ({ condition, primaryTraitElementId: left, secondaryTraitElementId: right }) => ({
              type: condition as v.RuleEnum,
              with: left === t.id ? right : left,
            })
          ),
        })),
      }))
    ),
    v.seed(repositoryId, collection.name, collection.generations, id)
  )

  const hash = v.hash(elements)

  return (
    <div className={clsx('relative flex-col border border-mediumGrey rounded-[5px] shadow-lg')}>
      <div className='py-8 overflow-hidden'>
        <motion.div
          whileHover={{
            scale: canHover ? 1.05 : 1.0,
            transition: { duration: 1 },
          }}
          className='relative'
        >
          {elements.map(([l, t], index) => {
            return (
              <img
                key={`${hash}-${t}-${index}`}
                className={clsx(
                  index === elements.length - 1 ? 'relative' : 'absolute',
                  'w-full h-auto border-t border-b border-mediumGrey'
                )}
                src={getImageForTrait({
                  r: repositoryId,
                  l,
                  t,
                })}
              />
            )
          })}
        </motion.div>
      </div>
      {children}
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
  const { all: layers } = useQueryRepositoryLayer()
  const { current: collection } = useQueryRepositoryCollection()
  const { current } = useQueryRepository()
  const { tokens, tokenRanking, repositoryId } = useRepositoryStore((state) => {
    return {
      tokenRanking: state.tokenRanking,
      tokens: state.tokens,
      repositoryId: state.repositoryId,
    }
  })

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
              <div
                key={`${item}-${index}`}
                className='flex flex-col rounded-[5px] cursor-pointer'
                onClick={() => setSelectedToken(item || null)}
              >
                <PreviewImage canHover id={item} collection={collection} layers={layers} repositoryId={repositoryId}>
                  <div className='px-1 flex flex-col space-y-1 mb-3'>
                    <span className='text-xs font-semibold overflow-hidden w-full'>{`${current?.tokenName || ''} #${
                      item || 0
                    }`}</span>
                    <div className='flex flex-col text-[0.6rem]'>
                      <span className='font-semibold overflow-hidden w-full'>
                        <span className='text-darkGrey'>Rank {tokenRanking.findIndex((x) => x.index === item) + 1}</span>
                      </span>
                      <span className='text-darkGrey overflow-hidden w-full'>
                        OpenRarity Score {tokenRanking.find((x) => x.index === item)?.score.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </PreviewImage>
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
                  <Dialog.Panel className='relative bg-white rounded-[5px] border max-w-lg border-lightGray overflow-hidden shadow-xl transform transition-all w-1/2'>
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
