import { toPascalCaseWithSpace } from '@utils/format'
import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { TraitElement } from '@prisma/client'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { createToken } from '@utils/compiler'
import { env } from 'src/env/client.mjs'

const InfiniteScrollGridItem = ({
  token,
  repositoryName,
  organisationName,
  name,
}: {
  token: TraitElement[]
  repositoryName: string
  organisationName: string
  name: string
}) => {
  const { layers } = useRepositoryStore((state) => {
    return {
      collection: state.collection,
      layers: state.layers,
    }
  })
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
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
    show: {
      opacity: 1,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
  }
  return (
    <motion.div
      className='flex flex-col space-y-2'
      variants={item}
      initial='hidden'
      animate={controls}
      ref={ref}
    >
      <div className='h-[150px] overflow-hidden' style={{ transformStyle: 'preserve-3d' }}>
        {token.map((traitElement: TraitElement, index: number) => {
          return (
            <div className='absolute w-full h-full flex flex-col items-center' key={index}>
              <Image
                width={200}
                height={200}
                className='rounded-[5px] border-[1px] border-lightGray'
                src={`${env.NEXT_PUBLIC_CLOUDINARY_URL}/image/upload/${
                  env.NEXT_PUBLIC_CLOUDINARY_LOW_RES_IMAGES ? 'c_fill,h_200,w_200' : ''
                }/v1/${organisationName}/${repositoryName}/layers/${toPascalCaseWithSpace(
                  layers[index]?.name || ''
                )}/${toPascalCaseWithSpace(traitElement.name)}.png`}
              />
            </div>
          )
        })}
      </div>
      <span className='text-xs flex justify-center'>{name}</span>
    </motion.div>
  )
}

export default InfiniteScrollGridItem
