import useRepositoryStore from '@hooks/useRepositoryStore'
import { useEffect } from 'react'

import { createManyTokens, getTokenRanking, getTraitMappings } from '@utils/compiler'
import { trpc } from '@utils/trpc'
import AdvancedImage from '../CollectionHelpers/AdvancedImage'
import { CollectionViewContent } from '../CollectionHelpers/ViewContent'
import { InfiniteScrollGrid } from './InfiniteScrollGrid'

const CollectionPreview = () => {
  const { setTraitMapping, setTokenRanking, collectionId, repositoryId } = useRepositoryStore((state) => {
    return {
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
      collectionId: state.collectionId,
      repositoryId: state.repositoryId,
    }
  })

  const { data: collection } = trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
  const { data: layers } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])

  useEffect(() => {
    if (!collection || !layers) return
    const tokens = createManyTokens(layers, collection.totalSupply, collection.name, collection.generations)
    const { tokenIdMap, traitMap } = getTraitMappings(tokens)
    setTraitMapping({
      tokenIdMap,
      traitMap,
    })
    setTokenRanking(getTokenRanking(tokens, traitMap, collection.totalSupply))
  }, [collection, layers])

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      {collection && layers ? (
        <InfiniteScrollGrid collection={collection} />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 4xl:grid-cols-6 xl:gap-y-6 xl:gap-x-6 overflow-hidden'>
          {Array.from(Array(50).keys()).map((index: number) => {
            return (
              <div key={index} className="flex flex-col items-center">
                <div className='border border-lightGray rounded-[5px]'>
                  <AdvancedImage url='' />
                </div>
                <span className='text-xs flex items-center justify-center'>...</span>
              </div>
            )
          })}
        </div>
      )}
    </CollectionViewContent>
  )
}

export default CollectionPreview
