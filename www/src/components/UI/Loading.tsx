import { motion } from 'framer-motion'

const Loading = () => {
  return (
    // <div className='w-full h-[calc(100vh-5rem)] flex items-center justify-center'>
    <motion.div
      className='box border-[3px] w-5 h-5'
      animate={{
        scale: [1, 1.5, 1.5, 1, 1],
        rotate: [0, 0, 180, 180, 0],
        borderRadius: ['20%', '20%', '50%', '50%', '20%'],
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1,
      }}
    />
    // </div>
  )
}

export default Loading
