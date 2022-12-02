import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'

export interface Props {
  as: React.ElementType
}

export type MenuItemProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>

const ModalItemComponent = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<MenuItemProps>>(
  ({ as, className, children, ...props }: React.PropsWithChildren<MenuItemProps>, ref: React.Ref<HTMLAnchorElement>) => {
    return (
      <Menu.Items
        {...props}
        as={as}
        ref={ref}
        className={clsx(className, 'flex items-center w-full py-1.5 px-1 space-x-2 text-xs rounded-[3px] hover:bg-mediumGrey')}
      >
        {children}
      </Menu.Items>
    )
  }
)

ModalItemComponent.displayName = 'ModalItem'
export default ModalItemComponent
