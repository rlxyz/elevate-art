import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { createCompilerApp } from '@utils/createCompilerApp'
import { fetcher, fetcherPost } from '@utils/fetcher'
import { toPascalCaseWithSpace } from '@utils/format'
import { App } from '@utils/x/App'
import Collection from '@utils/x/Collection'
import { ethers } from 'ethers'
import mergeImages from 'merge-images'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'

import { CollectionViewContent } from './ViewContent'

const CollectionGenerateView = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [images, setImages] = useState<ReactNode>(null)
  const collectionTotalSupply = 50
  const {
    collection,
    regenerate,
    repository,
    setArtCollection,
    setRegenerateCollection,
  } = useCompilerViewStore((state) => {
    return {
      collection: state.collection,
      regenerate: state.regenerate,
      repository: state.repository,
      setArtCollection: state.setArtCollection,
      setRegenerateCollection: state.setRegenerateCollection,
    }
  })

  const handler = async (regenerate: boolean) => {
    const app: App = createCompilerApp(repositoryName)
    const response = regenerate
      ? await fetcherPost(`collection/${collection.id}/generate`, {})
      : await fetcher(`collection/${collection.id}/generate`)
    const _collection: Collection = await app.createRandomCollectionFromSeed(
      collectionTotalSupply,
      parseInt(
        ethers.utils
          .keccak256(
            ethers.utils.toUtf8Bytes(`${collection.id}-${response.generations}`)
          )
          .toString(),
        16
      )
    )
    setArtCollection(_collection)
    return await _collection.tokens.map(
      async (token) =>
        await mergeImages(
          token.attributes.map(
            (attribute) =>
              `${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/image/upload/${
                process.env.NEXT_PUBLIC_CLOUDINARY_LOW_RES_IMAGES
                  ? 'c_fill,h_300,w_300'
                  : ''
              }/v1/${organisationName}/${repositoryName}/layers/${toPascalCaseWithSpace(
                attribute['trait_type']
              )}/${toPascalCaseWithSpace(attribute['value'])}.png`
          ),
          { crossOrigin: 'Anonymous' }
        )
    )
  }

  useEffect(() => {
    regenerate &&
      handler(true)
        .then((data) => Promise.all(data))
        .then((data: string[]) => {
          setImages(
            data.map((src: string, index: number) => {
              return (
                <div
                  className='flex flex-col items-center'
                  key={`gen-${index}`}
                >
                  <Image
                    width={300}
                    height={300}
                    className='rounded-md'
                    src={src}
                  />
                  <span className='py-2 text-xs'>{`${repository.tokenName} #${index}`}</span>
                </div>
              )
            })
          )
        })
        .then(() => setRegenerateCollection(false))
  }, [regenerate])

  useEffect(() => {
    handler(false)
      .then((data) => Promise.all(data))
      .then((data: string[]) => {
        setImages(
          data.map((src: string, index: number) => {
            return (
              <div className='flex flex-col items-center' key={`gen-${index}`}>
                <Image
                  width={300}
                  height={300}
                  className='rounded-md'
                  src={src}
                />
                <span className='py-2 text-xs'>{`${repository.tokenName} #${index}`}</span>
              </div>
            )
          })
        )
      })
  }, [])

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      <div className='p-8'>
        <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-7'>
          {images}
        </div>
      </div>
    </CollectionViewContent>
  )
}

export default CollectionGenerateView
