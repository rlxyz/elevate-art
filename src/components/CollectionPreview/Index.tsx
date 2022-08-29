import useRepositoryStore from '@hooks/useRepositoryStore'
import { useNotification } from '@hooks/useNotification'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'

import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'
import { useArtCollectionStore } from '@hooks/useArtCollectionStore'
import { createCollectionSeed, createCompilerApp } from '@utils/createCompilerApp'
import { TraitElement } from '@prisma/client'
import { element } from '@rainbow-me/rainbowkit/dist/css/reset.css'
import { useMutation } from 'react-query'
import { trpc } from '@utils/trpc'
import { createManyTokens, getTraitMappings } from '@utils/compiler'

const CollectionPreview = () => {
  const { setTraitMapping, setRegenerateCollection, layers, collection, regenerate } =
    useRepositoryStore((state) => {
      return {
        setTraitMapping: state.setTraitMapping,
        setRegenerateCollection: state.setRegenerateCollection,
        regenerate: state.regenerate,
        layers: state.layers,
        collection: state.collection,
      }
    })
  const [hasHydrated, setHasHydrated] = useState(false)

  const { data: collectionData } = trpc.useQuery([
    'collection.getCollectionById',
    { id: collection.id },
  ])

  useEffect(() => {
    if (!collectionData) return
    const tokens = createManyTokens(
      layers,
      collectionData.totalSupply,
      collectionData.name,
      collectionData.generations
    )
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    setHasHydrated(true)
  }, [collectionData])

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      {hasHydrated && <InfiniteScrollGrid collectionId={collection.id} />}
    </CollectionViewContent>
  )
}

export default CollectionPreview
