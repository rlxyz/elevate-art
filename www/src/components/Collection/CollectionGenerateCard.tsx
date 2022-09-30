import CollectionIncrementGenerationDialog from '@components/Actions/CollectionIncrementGenerationDialog'
import Button from '@components/Layout/Button'
import Image from 'next/image'

import { useState } from 'react'

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
