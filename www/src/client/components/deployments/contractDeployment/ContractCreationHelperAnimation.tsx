import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { ChevronLeftIcon, ChevronRightIcon, CubeIcon, MoonIcon } from '@heroicons/react/outline'
import useContractCreationStore from '@hooks/store/useContractCreationStore'
import clsx from 'clsx'
import { AnimatePresence, useMotionValue } from 'framer-motion'
import type { FC } from 'react'
import { useEffect } from 'react'
import { ButtonWithSelector } from './ButtonWithSelector'
import { CarouselSegment } from './CarouselSegment'
import { LineWithGradient } from './LineWithGradient'
import { useAnimationMotionValues } from './useAnimationMotionValues'

/** @todo modularise */
export const ContractCreationHelperAnimation: FC<{ className: string }> = ({ className }) => {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.75)
  const z = useMotionValue(1)

  const opacityX = useMotionValue(1)
  const opacityY = useMotionValue(0.5)
  const opacityZ = useMotionValue(0.25)
  const { handleClick } = useAnimationMotionValues()
  const { currentSegment, setCurrentSegment, motionValues, setMotionValue } = useContractCreationStore()

  useEffect(() => {
    setMotionValue(0, x, 'x')
    setMotionValue(1, y, 'x')
    setMotionValue(2, z, 'x')
    setMotionValue(0, opacityX, 'opacity')
    setMotionValue(1, opacityY, 'opacity')
    setMotionValue(2, opacityZ, 'opacity')
  }, [])

  if (motionValues['x'][0] === null) return null

  return (
    <div className={clsx('flex h-full flex-col items-center w-full space-y-9', className)}>
      {/* <div className='relative grid grid-flow-col justify-items-center gap-2 pt-2'>
              <button className='h-1.5 w-1.5 bg-mediumGrey rounded-full transition-all duration-300 !bg-black' />
              <button className='h-1.5 w-1.5 bg-mediumGrey rounded-full' />
              <button className='h-1.5 w-1.5 bg-mediumGrey rounded-full' />
            </div> */}
      <div className='relative my-2 flex h-20 w-full items-center overflow-x-hidden rounded-[5px]'>
        <AnimatePresence>
          {motionValues['x'][0] && (
            <CarouselSegment
              enabled={currentSegment === 0}
              transformOutputRange={['15%', '32.5%', '50%']}
              transformInputRange={[0, 0.25, 0.5]}
              index={0}
              onClick={handleClick}
              x={motionValues['x'][0]}
              opacity={opacityX}
            >
              <TriangleIcon className='w-8 h-8 -translate-y-[1.5px] text-black' />
            </CarouselSegment>
          )}
          {motionValues['x'][1] && (
            <>
              <CarouselSegment
                enabled={currentSegment === 1}
                transformOutputRange={['32.5%', '50%', '67.5%']}
                transformInputRange={[0.25, 0.5, 0.75]}
                index={1}
                onClick={handleClick}
                x={motionValues['x'][1]}
                opacity={opacityY}
              >
                <CubeIcon className='w-10 h-10 text-black' />
              </CarouselSegment>
            </>
          )}
          {motionValues['x'][2] && (
            <CarouselSegment
              enabled={currentSegment === 2}
              transformOutputRange={['50%', '67.5%', '85%']}
              transformInputRange={[0.5, 0.75, 1]}
              index={2}
              onClick={handleClick}
              x={motionValues['x'][2]}
              opacity={opacityZ}
            >
              <MoonIcon className='w-10 h-10 text-black' />
            </CarouselSegment>
          )}
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
