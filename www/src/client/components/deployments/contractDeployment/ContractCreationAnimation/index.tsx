import useContractCreationStore from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { AnimatePresence } from 'framer-motion'
import type { FC } from 'react'
import type { ContractCreationAnimationProps } from '..'
import { ButtonWithSelector } from './ButtonWithSelector'
import { CarouselSegment } from './CarouselSegment'
import { LineWithGradient } from './LineWithGradient'
import { useAnimationMotionValues } from './useAnimationMotionValues'

export const ContractCreationHelperAnimation: FC<{
  className: string
  contractCreationAnimation: ContractCreationAnimationProps[]
}> = ({ className, contractCreationAnimation }) => {
  const { handleClick } = useAnimationMotionValues()
  const { currentSegment } = useContractCreationStore()
  return (
    <div className={clsx('flex h-full flex-col items-center w-full space-y-9', className)}>
      <div className='relative my-2 flex h-20 w-full items-center overflow-x-hidden rounded-[5px]'>
        <AnimatePresence>
          {contractCreationAnimation.map((item) => (
            <CarouselSegment
              key={item.id}
              enabled={currentSegment === item.id}
              transformOutputRange={item.transformOutputRange}
              transformInputRange={item.transformInputRange}
              index={item.index}
              x={item.motionX}
              id={item.id}
              opacity={item.motionOpacity}
              onClick={handleClick}
            >
              {item.icon}
            </CarouselSegment>
          ))}
        </AnimatePresence>

        <ButtonWithSelector
          onClick={() => {
            const segment = contractCreationAnimation.find((item) => item.id === currentSegment)
            if (!segment) return
            if (!segment.previous) return
            handleClick(segment.previous)
          }}
          disabled={contractCreationAnimation.find((item) => item.id === currentSegment)?.previous === null}
        >
          <ChevronLeftIcon className='w-4 h-4 text-darkGrey' />
        </ButtonWithSelector>
        <LineWithGradient />
        <ButtonWithSelector
          onClick={() => {
            const segment = contractCreationAnimation.find((item) => item.id === currentSegment)
            if (!segment) return
            if (!segment.next) return
            handleClick(segment.next)
          }}
          disabled={contractCreationAnimation.find((item) => item.id === currentSegment)?.next === null}
        >
          <ChevronRightIcon className='w-4 h-4 text-darkGrey' />
        </ButtonWithSelector>
      </div>
    </div>
  )
}
