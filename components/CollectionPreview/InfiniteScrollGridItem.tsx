import { toPascalCaseWithSpace } from '@utils/format'
import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const InfiniteScrollGridItem = ({
  token,
  repositoryName,
  organisationName,
  name,
}: {
  token: any
  repositoryName: string
  organisationName: string
  name: string
}) => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start('show')
    }
  }, [controls, inView])

  const item = {
    hidden: {
      opacity: 0,
      y: 50,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
  }

  return (
    <motion.div
      className='flex flex-col'
      variants={item}
      initial='hidden'
      animate={controls}
      ref={ref}
    >
      <div
        className='h-[120px] overflow-hidden'
        style={{ transformStyle: 'preserve-3d' }}
      >
        {token.attributes.map((attribute, index) => {
          return (
            <div
              className='absolute w-full h-full flex flex-col items-center'
              key={index}
            >
              <img
                className='rounded-[5px] border-[1px] border-lightGray'
                src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/image/upload/${
                  process.env.NEXT_PUBLIC_CLOUDINARY_LOW_RES_IMAGES
                    ? 'c_fill,h_200,w_200'
                    : ''
                }/v1/${organisationName}/${repositoryName}/layers/${toPascalCaseWithSpace(
                  attribute['trait_type']
                )}/${toPascalCaseWithSpace(attribute['value'])}.png`}
              />
            </div>
          )
        })}
      </div>
      <span className='text-xs'>{name}</span>
    </motion.div>
  )
}

export default InfiniteScrollGridItem
