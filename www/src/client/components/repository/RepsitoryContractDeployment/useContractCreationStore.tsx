import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { CubeIcon, MoonIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { AnimatePresence, useMotionValue } from 'framer-motion'
import React from 'react'
import { z } from 'zod'
import { CarouselSegment } from './CarouselSegment'
import { ContactDetailsForm } from './ContactCreationForms/ContactDetailsForm'
import { ContractCompletionForm } from './ContactCreationForms/ContractCompletionForm'
import { MintDetailsForm } from './ContactCreationForms/MintDetailsForm'
import { useContractCreationStore } from './useContractCreationStore.1'

interface ContractCreationSegmentProps {
  id: string
  title: string
  description: string
  component: () => React.ReactElement
  icon: React.ReactNode
}

export const ContractCreationEnum = z.nativeEnum(
  Object.freeze({
    ContractDetails: 'contract-detail',
    MintDetails: 'mint-details',
  })
)

export type ContractCreationType = z.infer<typeof ContractCreationEnum>
export const ContractCreationSegments: ContractCreationSegmentProps[] = [
  {
    id: 'contract-base-details',
    title: 'Smart Contract Details',
    description: 'Enter the details of your smart contract',
    component: ContactDetailsForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
  },
  {
    id: 'mint-details',
    title: 'Mint Details',
    description: 'Enter the details of your mint',
    component: MintDetailsForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
  },
  {
    id: 'contract-completion',
    title: 'ContractCompletionForm Details',
    description: 'Enter the details of your mint',
    component: ContractCompletionForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
  },
]
/** @todo modularise */
export const ContractCreationHelperAnimation = () => {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.75)
  const z = useMotionValue(1)

  const opacityX = useMotionValue(1)
  const opacityY = useMotionValue(0.5)
  const opacityZ = useMotionValue(0.25)

  const { currentSegment, setCurrentSegment } = useContractCreationStore()

  const handleClick = (index: number) => {
    if (currentSegment === index) return null
    setCurrentSegment(index)

    if (index === 0) {
      x.set(0.5)
      y.set(0.75)
      z.set(1)
      opacityX.set(1)
      opacityY.set(0.5)
      opacityZ.set(0.25)
    } else if (index === 1) {
      x.set(0.25)
      y.set(0.5)
      z.set(0.75)
      opacityX.set(0.5)
      opacityY.set(1)
      opacityZ.set(0.5)
    } else if (index === 2) {
      x.set(0.0)
      y.set(0.25)
      z.set(0.5)
      opacityX.set(0.25)
      opacityY.set(0.5)
      opacityZ.set(1)
    }
  }

  return (
    <div className='flex h-full flex-col items-center w-full space-y-9'>
      {/* <div className='relative grid grid-flow-col justify-items-center gap-2 pt-2'>
              <button className='h-1.5 w-1.5 bg-mediumGrey rounded-full transition-all duration-300 !bg-black' />
              <button className='h-1.5 w-1.5 bg-mediumGrey rounded-full' />
              <button className='h-1.5 w-1.5 bg-mediumGrey rounded-full' />
            </div> */}
      <div className='relative my-2 flex h-20 w-full items-center overflow-x-hidden rounded-[5px]'>
        <AnimatePresence>
          <CarouselSegment
            enabled={currentSegment === 0}
            transformOutputRange={['15%', '32.5%', '50%']}
            transformInputRange={[0, 0.25, 0.5]}
            index={0}
            onClick={handleClick}
            x={x}
            opacity={opacityX}
          >
            <TriangleIcon className='w-8 h-8 -translate-y-[1.5px] text-black' />
          </CarouselSegment>
          <CarouselSegment
            enabled={currentSegment === 1}
            transformOutputRange={['32.5%', '50%', '67.5%']}
            transformInputRange={[0.25, 0.5, 0.75]}
            index={1}
            onClick={handleClick}
            x={y}
            opacity={opacityY}
          >
            <CubeIcon className='w-10 h-10 text-black' />
          </CarouselSegment>
          <CarouselSegment
            enabled={currentSegment === 2}
            transformOutputRange={['50%', '67.5%', '85%']}
            transformInputRange={[0.5, 0.75, 1]}
            index={2}
            onClick={handleClick}
            x={z}
            opacity={opacityZ}
          >
            <MoonIcon className='w-10 h-10 text-black' />
          </CarouselSegment>
        </AnimatePresence>
        <button
          onClick={() => {
            handleClick(currentSegment - 1)
          }}
          className={clsx(
            'relative z-1 rounded-full border border-mediumGrey bg-white p-sm transition hover:bg-lightGray false text-darkGrey',
            currentSegment === 0 && 'opacity-0 pointer-events-none'
          )}
        >
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='block shrink-0'>
            <path
              d='M14.25 6.75L9.70711 11.2929C9.31658 11.6834 9.31658 12.3166 9.70711 12.7071L14.25 17.25'
              stroke='currentColor'
              stroke-width='1.5'
              stroke-linecap='round'
              stroke-linejoin='round'
            ></path>
          </svg>
        </button>
        <div className='relative h-[1px] flex-1 bg-gradient-to-r from-mediumGrey via-blueHighlight to-mediumGrey z-[-1]' />
        <button
          onClick={() => {
            handleClick(currentSegment + 1)
          }}
          className={clsx(
            'relative z-1 rounded-full border border-mediumGrey bg-white p-sm transition hover:bg-lightGray false text-darkGrey',
            currentSegment === 2 && 'opacity-0 pointer-events-none'
          )}
        >
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='block shrink-0'>
            <path
              d='M9.75 17.25L14.2929 12.7071C14.6834 12.3166 14.6834 11.6834 14.2929 11.2929L9.75 6.75'
              stroke='currentColor'
              stroke-width='1.5'
              stroke-linecap='round'
              stroke-linejoin='round'
            ></path>
          </svg>
        </button>
      </div>
    </div>
  )
}
