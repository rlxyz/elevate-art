import React from 'react'

export const LinkIconComponent: React.FC<unknown> = () => {
  return (
    <svg
      viewBox='0 0 24 24'
      width='0.7em'
      height='0.7em'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
      shapeRendering='geometricPrecision'
      className='inline-flex items-center mb-[0.1875em] ml-[2px]'
    >
      <path d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6' />
      <path d='M15 3h6v6' />
      <path d='M10 14L21 3' />
    </svg>
  )
}

LinkIconComponent.displayName = 'LinkIcon'
const LinkIcon = React.memo(LinkIconComponent)
export default LinkIcon
