import AdvancedImage from '@components/Collection/CollectionHelpers/AdvancedImage'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { toPascalCaseWithSpace } from '@utils/format'
import { trpc } from '@utils/trpc'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

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
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data: layers } = trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
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

  if (!layers || !layers.length) return null

  return (
    <motion.div
      className='flex flex-col space-y-2 justify-center items-center'
      variants={item}
      initial='hidden'
      animate={controls}
      ref={ref}
    >
      <div className='h-[125px] w-[125px] w- overflow-hidden' style={{ transformStyle: 'preserve-3d' }}>
        {token.map((traitElement: TraitElement, index: number) => {
          return (
            <div className='absolute flex flex-col items-center justify-center' key={index}>
              <AdvancedImage
                url={`${organisationName}/${repositoryName}/layers/${toPascalCaseWithSpace(
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
