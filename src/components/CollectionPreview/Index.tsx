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
import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import LayerFolderSelector from '@components/CollectionHelpers/LayerFolderSelector'

const CollectionPreview = () => {
  const {
    setTraitMapping,
    setTokenRanking,
    setRegenerateCollection,
    layers,
    collection,
    regenerate,
  } = useRepositoryStore((state) => {
    return {
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
      setRegenerateCollection: state.setRegenerateCollection,
      regenerate: state.regenerate,
      layers: state.layers,
      collection: state.collection,
    }
  })

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
    setTokenRanking(getTokenRanking(tokens, traitMap, collectionData.totalSupply))
  }, [collectionData])

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      <InfiniteScrollGrid collectionId={collection.id} />
    </CollectionViewContent>
  )
}

export default CollectionPreview
