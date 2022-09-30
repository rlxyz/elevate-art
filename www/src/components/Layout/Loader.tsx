import { motion } from 'framer-motion'

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const DotVariants = {
  initial: {
    y: '0%',
  },
  animate: {
    y: '100%',
  },
}

const DotTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: 'easeInOut',
}

const Loader = () => {
  return (
    <div className='w-full flex items-center justify-center'>
      <motion.div
        className='w-[1rem] h-[1rem] flex justify-around'
        variants={ContainerVariants}
        initial='initial'
        animate='animate'
      >
        <motion.span
          className='block w-[3px] h-[3px] bg-black rounded-[50%]'
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          className='block w-[3px] h-[3px] bg-black rounded-[50%]'
          variants={DotVariants}
          transition={DotTransition}
        />
        <motion.span
          className='block w-[3px] h-[3px] bg-black rounded-[50%]'
          variants={DotVariants}
          transition={DotTransition}
        />
      </motion.div>
    </div>
  )
}

export default Loader
