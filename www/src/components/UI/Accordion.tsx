import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

interface AccordionProps {
  label: string
  children: React.ReactNode
}

export const Accordion: React.FC<AccordionProps> = ({ label, children }) => {
  const [expanded, setExpanded] = React.useState(false)

  const arrowIcon = expanded
    ? '/images/accordion/down-arrow.svg'
    : '/images/accordion/right-arrow.svg'
  const iconAltText = expanded ? 'Expanded' : 'Collapse'

  return (
    <>
      <motion.button
        initial={false}
        onClick={() => setExpanded((prev) => !prev)}
        className='w-full py-4 text-left flex mb-2 items-center'
      >
        <img src={arrowIcon} className='w-3 h-3 mr-2' alt={iconAltText} />
        <span className='block font-bold'>{label}</span>
      </motion.button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {children}
          </motion.section>
        ) : (
          <hr className='border-lightGray' />
        )}
      </AnimatePresence>
    </>
  )
}
