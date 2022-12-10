import clsx from 'clsx'
import React from 'react'

const ModalItemComponent: React.FC<React.PropsWithChildren<React.AnchorHTMLAttributes<any>>> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={clsx(className, 'p-2 flex flex-col items-start w-full')}>
      {children}
    </div>
  )
}

ModalItemComponent.displayName = 'ModalItem'
export default ModalItemComponent
