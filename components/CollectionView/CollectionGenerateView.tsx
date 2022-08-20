import useCompilerViewStore from '@hooks/useCompilerViewStore'
import { useNotification } from '@hooks/useNotification'
import { createCompilerApp } from '@utils/createCompilerApp'
import { fetcher, fetcherPost } from '@utils/fetcher'
import { toPascalCaseWithSpace } from '@utils/format'
import { App } from '@utils/x/App'
import Collection from '@utils/x/Collection'
import { ethers } from 'ethers'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'

import { CollectionViewContent } from './ViewContent'

const CollectionGenerateView = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionTotalSupply = 1000
  const {
    collection,
    regenerate,
    repository,
    artCollection,
    setArtCollection,
    setRegenerateCollection,
  } = useCompilerViewStore((state) => {
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

  const handler = async (regenerate: boolean) => {
    const app: App = createCompilerApp(repositoryName)
    const _collection: Collection = await app.createRandomCollectionFromSeed(
      collectionTotalSupply,
      parseInt(
        ethers.utils
          .keccak256(
            ethers.utils.toUtf8Bytes(
              `${collection.id}-${collection.generations + 1}`
            )
          )
          .toString(),
        16
      )
    )
    setArtCollection(_collection)
  }

  useEffect(() => {
    if (regenerate) {
      notifySuccess()
      console.log('start')
      handler(true).then(async () => {
        console.log('done')
        setRegenerateCollection(false)
        regenerate
          ? await fetcherPost(`collection/${collection.id}/generate`, {})
          : await fetcher(`collection/${collection.id}/generate`)
      })
    }
  }, [regenerate])

  useEffect(() => {
    handler(false)
  }, [])

  return (
    <CollectionViewContent
      title='Generate your Collection'
      description='Create different token sets before finalising the collection'
    >
      <div className='p-8'>
        <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-7 min-h-screen'>
          {artCollection?.tokens.map((token, index) => {
            return (
              <div
                className='h-[140px] w-full overflow-hidden'
                style={{ transformStyle: 'preserve-3d' }}
              >
                {token.attributes.map((attribute) => {
                  return (
                    <div className='absolute w-full flex flex-col items-center space-y-2'>
                      <Image
                        width={125}
                        height={125}
                        className='rounded-[5px] border-[1px] border-lightGray h-[125px] w-[125px]'
                        src={`${
                          process.env.NEXT_PUBLIC_CLOUDINARY_URL
                        }/image/upload/${
                          process.env.NEXT_PUBLIC_CLOUDINARY_LOW_RES_IMAGES
                            ? 'c_fill,h_300,w_300'
                            : ''
                        }/v1/${organisationName}/${repositoryName}/layers/${toPascalCaseWithSpace(
                          attribute['trait_type']
                        )}/${toPascalCaseWithSpace(attribute['value'])}.png`}
                      />
                      <span className='text-xs'>{`${repository.tokenName} #${index}`}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </CollectionViewContent>
  )
}

export default CollectionGenerateView
