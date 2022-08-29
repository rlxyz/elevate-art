import useRepositoryStore from '@hooks/useRepositoryStore'
import { useNotification } from '@hooks/useNotification'
import ArtCollection from '@utils/x/Collection'
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
import { compiler } from '@utils/compiler'

const CollectionPreview = () => {
  const { setTokens, tokens, setRegenerateCollection, layers, collection, regenerate } =
    useRepositoryStore((state) => {
      return {
        setTokens: state.setTokens,
        setRegenerateCollection: state.setRegenerateCollection,
        regenerate: state.regenerate,
        tokens: state.tokens,
        layers: state.layers,
        collection: state.collection,
      }
    })
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setTokens(compiler(layers, 250, collection.name, collection.generations))
    setHasHydrated(true)
  }, [])

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
