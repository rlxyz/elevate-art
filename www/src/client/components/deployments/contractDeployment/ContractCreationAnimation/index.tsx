import useContractCreationStore from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { ChevronLeftIcon, ChevronRightIcon, CubeIcon, MoonIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { AnimatePresence } from 'framer-motion'
import type { FC } from 'react'
import { ContractCreationEnum } from '../ContactCreationForm'
import { ButtonWithSelector } from './ButtonWithSelector'
import { CarouselSegment } from './CarouselSegment'
import { LineWithGradient } from './LineWithGradient'
import { useAnimationMotionValues } from './useAnimationMotionValues'

/** @todo modularise */
export const ContractCreationHelperAnimation: FC<{ className: string }> = ({ className }) => {
  const { handleClick } = useAnimationMotionValues()
  const { currentSegment } = useContractCreationStore()
  return (
    <div className={clsx('flex h-full flex-col items-center w-full space-y-9', className)}>
      <div className='relative my-2 flex h-20 w-full items-center overflow-x-hidden rounded-[5px]'>
        <AnimatePresence>
          <CarouselSegment
            enabled={currentSegment === ContractCreationEnum.enum.ContractDetails}
            transformOutputRange={['15%', '32.5%', '50%']}
            transformInputRange={[0, 0.25, 0.5]}
            index={0}
            x={0.5}
            opacity={1}
            onClick={handleClick}
          >
            <TriangleIcon className='w-8 h-8 -translate-y-[1.5px] text-black' />
          </CarouselSegment>
          <CarouselSegment
            enabled={currentSegment === ContractCreationEnum.enum.MintDetails}
            transformOutputRange={['32.5%', '50%', '67.5%']}
            transformInputRange={[0.25, 0.5, 0.75]}
            index={1}
            x={0.75}
            opacity={0.5}
            onClick={handleClick}
          >
            <CubeIcon className='w-10 h-10 text-black' />
          </CarouselSegment>
          <CarouselSegment
            enabled={currentSegment === ContractCreationEnum.enum.ContractCompletion}
            transformOutputRange={['50%', '67.5%', '85%']}
            transformInputRange={[0.5, 0.75, 1]}
            index={2}
            x={1}
            opacity={0.25}
            onClick={handleClick}
          >
            <MoonIcon className='w-10 h-10 text-black' />
          </CarouselSegment>
        </AnimatePresence>

        <ButtonWithSelector onClick={() => handleClick(currentSegment - 1)} enabled={currentSegment === 0}>
          <ChevronLeftIcon className='w-4 h-4 text-darkGrey' />
        </ButtonWithSelector>
        <LineWithGradient />
        <ButtonWithSelector onClick={() => handleClick(currentSegment + 1)} enabled={currentSegment === 2}>
          <ChevronRightIcon className='w-4 h-4 text-darkGrey' />
        </ButtonWithSelector>
      </div>
    </div>
  )
}
