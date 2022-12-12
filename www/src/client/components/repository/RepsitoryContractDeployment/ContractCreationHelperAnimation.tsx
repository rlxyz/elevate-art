import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { ChevronLeftIcon, ChevronRightIcon, CubeIcon, MoonIcon } from '@heroicons/react/outline'
import { useContractCreationStore } from '@hooks/store/useContractCreationStore'
import clsx from 'clsx'
import { AnimatePresence, useMotionValue } from 'framer-motion'
import type { FC } from 'react'
import { ButtonWithSelector } from './ButtonWithSelector'
import { CarouselSegment } from './CarouselSegment'
import { LineWithGradient } from './LineWithGradient'

/** @todo modularise */
export const ContractCreationHelperAnimation: FC<{ className: string }> = ({ className }) => {
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
    <div className={clsx('flex h-full flex-col items-center w-full space-y-9', className)}>
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
