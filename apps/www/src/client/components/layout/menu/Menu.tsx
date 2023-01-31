import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'
import ProfileAvatar from '../avatar/ProfileAvatar'

export interface Props {
  vertical?: boolean
  position?: 'bottom-left' | 'bottom-right' // add rest
}

export type MenuProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

const MenuComponent: React.FC<React.PropsWithChildren<MenuProps>> = ({
  className,
  vertical,
  position = 'bottom-right',
  children,
  ...props
}) => {
  return (
    <Menu as='div' className={clsx('absolute flex right-0 mr-2 items-center z-[5] top-1/2 -translate-y-1/2')}>
      <Menu.Button
        as={ProfileAvatar}
        // className='text-darkGrey rounded-[3px] hover:bg-mediumGrey w-3.5 h-3.5 mx-0.25 cursor-pointer'
      />
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items
          {...props}
          className={clsx(
            className,
            'font-normal absolute overflow-visible z-5 w-56 mt-2 bg-white rounded-md shadow-lg z-[5]',
            position === 'bottom-right' && 'top-1/2 -translate-y-1/4 left-5',
            position === 'bottom-left' && 'top-full right-0'
          )}
        >
          <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5'>
            <div className='bg-lightGray divide-y divide-mediumGrey '>{children}</div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

MenuComponent.displayName = 'Menu'
export default MenuComponent
