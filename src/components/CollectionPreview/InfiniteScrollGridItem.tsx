import { toPascalCaseWithSpace } from '@utils/format'
import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { ArtImageElement } from '@utils/x/Element'
import { ArtCollectionElement } from '@utils/x/Collection'
import { TraitElement } from '@prisma/client'
import useRepositoryStore from '@hooks/useRepositoryStore'

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
  const controls = useAnimation()
  const [ref, inView] = useInView()
  const layers = useRepositoryStore((state) => state.layers)
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
      className='flex flex-col space-y-2'
      variants={item}
      initial='hidden'
      animate={controls}
      ref={ref}
    >
      <div className='h-[120px] overflow-hidden' style={{ transformStyle: 'preserve-3d' }}>
        {token.map((traitElement: TraitElement, index: number) => {
          return (
            <div className='absolute w-full h-full flex flex-col items-center' key={index}>
              <Image
                width={125}
                height={125}
                className='rounded-[5px] border-[1px] border-lightGray'
                src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/image/upload/${
                  process.env.NEXT_PUBLIC_CLOUDINARY_LOW_RES_IMAGES ? 'c_fill,h_200,w_201' : ''
                }/v1/${organisationName}/${repositoryName}/layers/${toPascalCaseWithSpace(
                  layers[index]?.name // todo fix
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
