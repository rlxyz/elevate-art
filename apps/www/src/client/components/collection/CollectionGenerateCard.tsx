import { useQueryCollectionFindAll } from '@hooks/trpc/collection/useQueryCollectionFindAll'
import clsx from 'clsx'
import Image from 'next/image'
import Button from 'src/client/components/layout/Button'

import { useState } from 'react'
import CollectionIncrementGenerationDialog from './CollectionIncrementGenerationDialog'

export const GenerateButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { current: collection } = useQueryCollectionFindAll()
  return (
    <div
      className={clsx(
        !collection ? 'animate-pulse rounded-[5px] bg-mediumGrey bg-opacity-50 h-full' : 'border border-mediumGrey',
        'w-full h-full rounded-[5px] flex items-center justify-center'
      )}
    >
      <div className={clsx(!collection && 'invisible')}>
        <button disabled={!collection} onClick={() => setIsOpen(true)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-4 h-4 text-darkGrey'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
            />
          </svg>
        </button>
      </div>
      <CollectionIncrementGenerationDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

const Index = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <div className='flex items-center border border-mediumGrey rounded-[5px] px-4 py-3'>
        <div className='space-y-4'>
          <span className='font-normal flex flex-col text-xs space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold'>Generate</span>
            </div>
            <span className='text-darkGrey'>You can regenerate your collection by clicking this button.</span>
            <Button onClick={() => setIsOpen(true)}>
              <span className='flex items-center justify-center space-x-2'>
                <Image priority width={30} height={30} src='/images/logo-white.png' alt='Logo' />
                <span className='text-xs'>elevate.art</span>
              </span>
            </Button>
          </span>
        </div>
        <CollectionIncrementGenerationDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </>
  )
}

export default Index
