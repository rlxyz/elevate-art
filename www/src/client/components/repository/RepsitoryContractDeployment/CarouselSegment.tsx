import clsx from 'clsx'
import type { MotionValue } from 'framer-motion'
import { motion, useTransform } from 'framer-motion'
import React from 'react'

type CarouselSegmentProps = {
  transformOutputRange: string[]
  transformInputRange: number[]
  children: React.ReactNode
  index: number
  onClick: (index: number) => void
  x: MotionValue<number>
  opacity: MotionValue<number>
  enabled: boolean
}
export const CarouselSegment = ({
  transformOutputRange,
  transformInputRange,
  children,
  index,
  onClick,
  x,
  opacity,
  enabled,
}: CarouselSegmentProps) => {
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
