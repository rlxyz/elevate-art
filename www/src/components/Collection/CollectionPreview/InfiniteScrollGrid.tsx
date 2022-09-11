import useRepositoryStore from '@hooks/useRepositoryStore'
import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import { createToken } from '@utils/compiler'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
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
    <motion.div
      className='flex flex-col justify-center items-center border border-mediumGrey rounded-[5px] h-64 w-full'
      variants={item}
      initial='hidden'
      animate={controls}
      ref={ref}
    >
      <div className='overflow-hidden w-full h-full' style={{ transformStyle: 'preserve-3d' }}>
        {token.map(({ layerElementId, id }: TraitElement, index: number) => {
          return (
            <div className='absolute flex flex-col items-center justify-center h-full w-full' key={index}>
              <div className={`relative border-[1px] border-mediumGrey h-full w-full`}>
                <Image
                  priority
                  src={cld
                    .image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${layerElementId}/${id}.png`)
                    .toURL()}
                  layout='fill'
                  className='rounded-[5px]'
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
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

  if (!tokens || !tokens.length || !collection) return <></>

  return (
    <div className='grid grid-cols-4 gap-y-6 gap-x-6 overflow-hidden'>
      {tokensOnDisplay.slice(0, tokens.length).map((index: number) => {
        return (
          <div className='col-span-1'>
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
            <span className='p-2 text-xs font-semibold'>{`#${tokens[index] || 0}`}</span>
          </div>
        )
      })}
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
