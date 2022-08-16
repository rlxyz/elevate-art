import React from 'react'

interface RightContentContainerProps {
  firstHeading: React.ReactNode
  secondHeading: React.ReactNode
  children: React.ReactNode
}

export const RightContentContainer: React.FC<RightContentContainerProps> = ({
  firstHeading,
  secondHeading,
  children,
}) => {
  return (
    <>
      <div className='font-bold text-xl font-plus-jakarta-sans mb-5'>
        {firstHeading}
      </div>
      <hr className='border-lightGray' />
      <div className='py-10'>{secondHeading}</div>
      <div className='flex flex-col border border-lightGray rounded-lg p-5'>
        {children}
      </div>
    </>
  )
}
