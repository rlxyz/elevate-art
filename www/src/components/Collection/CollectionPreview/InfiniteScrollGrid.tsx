import AdvancedImage from '@components/Collection/CollectionHelpers/AdvancedImage'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { Collection, LayerElement, Rules, TraitElement } from '@prisma/client'
import { createToken } from '@utils/compiler'
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import * as InfiniteScrollComponent from 'react-infinite-scroll-component'
import { useInView } from 'react-intersection-observer'

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

  return (
    <motion.div
      className='flex flex-col space-y-2 justify-center items-center'
      variants={item}
      initial='hidden'
      animate={controls}
      ref={ref}
    >
      <div className='h-[125px] w-[125px] w- overflow-hidden' style={{ transformStyle: 'preserve-3d' }}>
        {token.map(({ layerElementId, id }: TraitElement, index: number) => {
          return (
            <div className='absolute flex flex-col items-center justify-center' key={index}>
              <AdvancedImage url={`${layerElementId}/${id}`} />
            </div>
          )
        })}
      </div>
      <span className='text-xs flex justify-center'>{name}</span>
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
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 4xl:grid-cols-6 xl:gap-y-6 xl:gap-x-6 overflow-hidden'>
      {tokensOnDisplay.slice(0, tokens.length).map((index: number) => {
        return (
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
