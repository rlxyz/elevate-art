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
      className="relative w-[450px] max-w-lg px-4 py-8 rounded-lg border border-gray shadow z-0"
      role="alert"
    >
      <div className="w-full flex items-center">{children}</div>
    </div>
  )
}
