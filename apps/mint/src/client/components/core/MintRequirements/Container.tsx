import cls from 'classnames'
import React from 'react'

interface Props {
  top?: boolean
  bottom?: boolean
  children: React.ReactNode
}

export const Container: React.FC<Props> = ({ children, top, bottom }) => {
  return (
    <div
      className={cls('flex items-center px-4 py-6 border-b border-b-lightGray border-r border-r-lightGray border-l border-l-lightGray', {
        'rounded-b-xl': bottom,
        'border-t border-t-lightGray rounded-t-xl': top,
      })}
    >
      {children}
    </div>
  )
}
