import useRepositoryStore from '@hooks/useCompilerViewStore'
import { useNotification } from '@hooks/useNotification'
import { fetcher, fetcherPost } from '@utils/fetcher'
import ArtCollection from '@utils/x/Collection'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import React, { ReactNode, useCallback } from 'react'

import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import InfiniteScrollGrid from './InfiniteScrollGrid'

const CollectionGenerateView = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionTotalSupply = 100
  const {
    collection,
    regenerate,
    repository,
    artCollection,
    setArtCollection,
    setRegenerateCollection,
  } = useRepositoryStore((state) => {
    return {
      collection: state.collection,
      regenerate: state.regenerate,
      repository: state.repository,
      artCollection: state.artCollection,
      setArtCollection: state.setArtCollection,
      setRegenerateCollection: state.setRegenerateCollection,
    }
  })
  const { notifySuccess } = useNotification(repositoryName)

  // const handler = async (regenerate: boolean) => {
  //   const app: App = createCompilerApp(repositoryName)
  //   const _collection: Collection = await app.createRandomCollectionFromSeed(
  //     collectionTotalSupply,
  //     parseInt(
  //       ethers.utils
  //         .keccak256(
  //           ethers.utils.toUtf8Bytes(
  //             `${collection.id}-${collection.generations + 1}`
  //           )
  //         )
  //         .toString(),
  //       16
  //     )
  //   )
  //   console.log('_collection', collection.generations + 1)
  //   setArtCollection(_collection)
  // }

  // useEffect(() => {
  //   if (regenerate) {
  //     notifySuccess()
  //     console.log('start')
  //     handler(true).then(async () => {
  //       console.log('done')
  //       setRegenerateCollection(false)
  //       regenerate
  //         ? await fetcherPost(`collection/${collection.id}/generate`, {})
  //         : await fetcher(`collection/${collection.id}/generate`)
  //     })
  //   }
  // }, [regenerate])

  // useEffect(() => {
  //   handler(false)
  // }, [])

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      <div className='p-8'>
        <InfiniteScrollGrid />
      </div>
    </CollectionViewContent>
  )
}

export default CollectionGenerateView
