import useContractCreationStore from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import clsx from 'clsx'
import type { MotionValue } from 'framer-motion'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import React, { useEffect } from 'react'

interface CarouselSegmentMotionProps extends CarouselSegmentProps {
  x: MotionValue<number>
  opacity: MotionValue<number>
}

interface CarouselSegmentProps {
  transformOutputRange: string[]
  transformInputRange: number[]
  children: React.ReactNode
  index: number
  onClick: (index: number) => void
  enabled: boolean
}

export const CarouselSegment = ({
  transformOutputRange,
  transformInputRange,
  children,
  x,
  opacity,
  index,
  onClick,
  enabled,
}: CarouselSegmentProps & { x: number; opacity: number }) => {
  const [hasHydrated, setHasHydrated] = React.useState(false)
  const { motionValues, setMotionValue } = useContractCreationStore()

  const mX = useMotionValue(x)
  const mOpacity = useMotionValue(opacity)

  useEffect(() => {
    setMotionValue(index, mX, 'x')
    setMotionValue(index, mOpacity, 'opacity')
    setHasHydrated(true)
  }, [])

  if (!hasHydrated) return null

  return (
    <CarouselSegmentMotion
      transformOutputRange={transformOutputRange}
      transformInputRange={transformInputRange}
      index={index}
      onClick={onClick}
      enabled={enabled}
      x={motionValues.x[index] as MotionValue<number>}
      opacity={motionValues.opacity[index] as MotionValue<number>}
    >
      {children}
    </CarouselSegmentMotion>
  )
}

export const CarouselSegmentMotion = ({
  transformOutputRange,
  transformInputRange,
  children,
  index,
  onClick,
  enabled,
  x,
  opacity,
}: CarouselSegmentMotionProps) => {
  const left = useTransform(x, transformInputRange, transformOutputRange)
  const opacitySegment = useTransform(opacity, [0, 1], [0, 1])
  return (
    <motion.button
      style={{ left }}
      onClick={() => onClick(index)}
      className={clsx('absolute rounded-full -translate-x-1/2 border-4 border-white bg-lightGray transition-all duration-300 z-1 scale-75')}
    >
      <motion.div
        style={{ opacity: opacitySegment }}
        className={clsx(
          'rounded-full border-[1px] p-2 transition-all duration-300',
          enabled ? 'border-blueHighlight bg-blueHighlight/10' : 'border-mediumGrey'
        )}
      >
        <div className='h-12 w-12 rounded-full  flex items-center justify-center'>{children}</div>
      </motion.div>
    </motion.button>
  )
}
