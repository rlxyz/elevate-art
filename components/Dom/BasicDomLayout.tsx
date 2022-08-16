import React from 'react'

const BasicDomLayout: React.FC = ({ children }) => {
  return (
    <>
      <div className='w-full h-full flex justify-center items-center md:p-12 lg:p-16'>
        <div
          className={`w-full h-full relative flex justify-center items-center`}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default BasicDomLayout
