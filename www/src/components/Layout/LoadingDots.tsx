import { motion } from 'framer-motion'

const loadingCircle = {
  display: 'block',
  width: '0.25rem',
  height: '0.25rem',
  backgroundColor: 'black',
  borderRadius: '0.25rem',
}

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const loadingCircleVariants = {
  start: {
    y: '50%',
  },
  end: {
    y: '150%',
  },
}

const loadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: 'easeInOut',
}

export default function LoadingDots() {
  return (
    <motion.div className='flex justify-center' variants={loadingContainerVariants} initial='start' animate='end'>
      <motion.span style={loadingCircle} variants={loadingCircleVariants} transition={loadingCircleTransition} />
      <motion.span style={loadingCircle} variants={loadingCircleVariants} transition={loadingCircleTransition} />
      <motion.span style={loadingCircle} variants={loadingCircleVariants} transition={loadingCircleTransition} />
    </motion.div>
  )
}
