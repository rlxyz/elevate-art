import useRepositoryStore from '@hooks/useRepositoryStore'
import { useNotification } from '@hooks/useNotification'
import ArtCollection from '@utils/x/Collection'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import seedrandom from 'seedrandom'

import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'
import { useArtCollectionStore } from '@hooks/useArtCollectionStore'
import { createCollectionSeed, createCompilerApp } from '@utils/createCompilerApp'
import { LayerElement, TraitElement, Rules } from '@prisma/client'
import { element } from '@rainbow-me/rainbowkit/dist/css/reset.css'

const CollectionPreview = () => {
  const { layers, collection } = useRepositoryStore((state) => {
    return {
      layers: state.layers,
      collection: state.collection,
    }
  })
  const [hasHydrated, setHasHydrated] = useState(false)
  const [tokens, setTokens] = useState<TraitElement[][]>([])

  const createCollectionFromSeed = (
    layers: (LayerElement & {
      traitElements: (TraitElement & { rules: Rules[] })[]
    })[],
    totalSupply: number,
    seed: string
  ): TraitElement[][] => {
    // sort all layers by priority
    // sort all trait elemnents by weight
    layers
      .sort((a, b) => a.priority - b.priority)
      .forEach(({ traitElements }: LayerElement & { traitElements: TraitElement[] }) =>
        traitElements.sort((a, b) => a.weight - b.weight)
      )

    const allElements: TraitElement[][] = []
    for (let i = 0, random = seedrandom(`${seed}${i}`); i < totalSupply; i++) {
      let elements: TraitElement[] = []
      layers.forEach(
        ({
          traitElements,
        }: LayerElement & { traitElements: (TraitElement & { rules: Rules[] })[] }) => {
          let r = Math.floor(random() * traitElements.reduce((a, b) => a + b.weight, 0))
          traitElements.every((traitElement: TraitElement & { rules: Rules[] }) => {
            r -= traitElement.weight
            if (r < 0) {
              elements.push(traitElement)
              return false
            }
            return true
          })
        }
      )
      allElements.push(elements)
    }
    return allElements
  }

  useEffect(() => {
    layers &&
      (setTokens(createCollectionFromSeed(layers, collection.totalSupply, `seed`)),
      setHasHydrated(true))
  }, [layers])

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      {hasHydrated && (
        <div className='p-8 h-full w-full'>
          <InfiniteScrollGrid tokens={tokens} />
        </div>
      )}
    </CollectionViewContent>
  )
}

export default CollectionPreview
