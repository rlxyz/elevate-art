import useRepositoryStore from '@hooks/useRepositoryStore'
import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { createToken } from '@utils/compiler'
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import { useInView } from 'react-intersection-observer'
import { clientEnv } from 'src/env/schema.mjs'

const InfiniteScrollGridItem = ({ token, name }: { token: TraitElement[]; name: string }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start('show')
    } else {
      controls.stop()
    }
  }, [controls, inView])

  const item = {
    hidden: {
      opacity: 0,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
    show: {
      opacity: 1,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
  }
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const cld = createCloudinary()
  return (
    <>
      <motion.div
        className='relative flex flex-col justify-center items-center border border-mediumGrey rounded-[5px] w-full h-full'
        variants={item}
        initial='hidden'
        animate={controls}
        ref={ref}
      >
        <div className='overflow-hidden w-full h-full' style={{ transformStyle: 'preserve-3d' }}>
          {token.map(({ layerElementId, id }: TraitElement, index: number) => {
            return (
              <div className='absolute flex flex-col items-center justify-center h-full w-full' key={index}>
                <div className={`relative h-full w-full`}>
                  <img
                    className='rounded-[5px]'
                    src={cld.image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${layerElementId}/${id}.png`).toURL()}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}

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
  const { tokens } = useRepositoryStore((state) => {
    return {
      tokens: state.tokens,
    }
  })
  const [selectedToken, setSelectedToken] = useState<{ traitElements: TraitElement[] }>({
    traitElements: [],
  })
  if (!tokens || !tokens.length || !collection) return <></>

  return (
    <div className='grid grid-cols-5 gap-y-6 gap-x-6 overflow-hidden'>
      {tokensOnDisplay.slice(0, tokens.length).map((index: number) => {
        const token = createToken({
          id: Number(tokens[index]),
          name: collection.name,
          generation: collection.generations,
          layers,
        })
        return (
          <div
            key={index}
            className='cursor-pointer relative col-span-1'
            onClick={() => setSelectedToken({ traitElements: token })}
          >
            <div className='pb-[100%] blocks'>
              <div className='absolute h-full w-full'>
                <InfiniteScrollGridItem
                  key={`${index}`}
                  token={createToken({
                    id: Number(tokens[index]),
                    name: collection.name,
                    generation: collection.generations,
                    layers,
                  })}
                  name={`#${tokens[index] || 0}`}
                />
              </div>
              {/* <span className='p-2 text-xs font-semibold'>{`#${tokens[index] || 0}`}</span> */}
            </div>
          </div>
        )
      })}
      {/* <Transition appear show={selectedToken.traitElements.length > 0} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() =>
            setSelectedToken({
              traitElements: [],
            })
          }
        >
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
                    <div className='pb-[100%] blocks'>
                      <div className='absolute h-full w-full'>
                        <InfiniteScrollGridItem token={selectedToken.traitElements} name={'#1'} />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
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
  const { hasPreviewLoaded, setHasPreviewLoaded } = useRepositoryStore((state) => {
    return {
      setHasPreviewLoaded: state.setHasPreviewLoaded,
      hasPreviewLoaded: state.hasPreviewLoaded,
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
    fetch(page)
    setHasPreviewLoaded(true)
  }, [])

  return (
    <InfiniteScrollComponent.default
      dataLength={tokensOnDisplay.length}
      next={() => {
        fetchMoreData(page)
      }}
      hasMore={hasMore}
      loader={<></>}
    >
      <InfiniteScrollGridItems tokensOnDisplay={tokensOnDisplay} layers={layers} collection={collection} />
    </InfiniteScrollComponent.default>
  )
}
