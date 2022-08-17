import * as React from 'react'

interface Props {
  children: React.ReactNode
  id: string
  type: 'success' | 'error'
}

export const Notification = ({ children, id }: Props) => {
  return (
    <div
      id={id}
      className='relative p-8 w-[350px] max-w-lg rounded-lg border border-lightGray shadow z-5 bg-white'
      role='alert'
    >
      <div className='w-full flex items-center'>{children}</div>
    </div>
  )
}
