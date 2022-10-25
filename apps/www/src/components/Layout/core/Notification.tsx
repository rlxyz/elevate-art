import clsx from 'clsx'
import * as React from 'react'

interface Props {
  children: React.ReactNode
  id: string
  type: 'success' | 'error'
}

export const Notification = ({ children, id, type }: Props) => {
  return (
    <div
      id={id}
      className={clsx(
        type === 'error' && 'bg-error',
        type === 'success' && 'bg-success',
        'relative p-4 w-[350px] max-w-lg rounded-[5px] shadow-lg z-[1000]'
      )}
      role='alert'
    >
      <div className='w-full flex items-center text-accents_8 text-xs'>{children}</div>
    </div>
  )
}
