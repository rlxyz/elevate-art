import React from 'react'

interface Props {
  children: React.ReactNode
}

export const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex items-center px-4 py-6 border-b border-b-lightGray">
      {children}
    </div>
  )
}
