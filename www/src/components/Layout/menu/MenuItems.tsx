import clsx from 'clsx'
import React from 'react'

export interface Props {}

export type MenuItemProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>

const ModalItemComponent: React.FC<React.PropsWithChildren<MenuItemProps>> = ({
  children,
  className,
  ...props
}: MenuItemProps) => {
  return (
    <div {...props} className={clsx(className, 'p-2 flex flex-col items-start w-full')}>
      {children}
    </div>
  )
}

ModalItemComponent.displayName = 'ModalItem'
export default ModalItemComponent
