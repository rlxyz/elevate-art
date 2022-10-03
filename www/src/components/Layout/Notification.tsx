import * as React from 'react'

interface Props {
  children: React.ReactNode
  id: string
  type: 'success' | 'error'
}

export const Notification = ({ children, id }: Props) => {
  return (
    <div id={id} className='relative p-4 w-[350px] max-w-lg rounded-[5px] shadow-md z-5 bg-blueHighlight' role='alert'>
      <div className='w-full flex items-center text-white text-xs'>{children}</div>
    </div>
  )
}
