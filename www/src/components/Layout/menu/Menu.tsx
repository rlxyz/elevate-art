import { Menu, Transition } from '@headlessui/react'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { FC, Fragment } from 'react'

export interface Props {}

export type MenuProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>

const MenuComponent: FC<MenuProps> = ({ className, children, ...props }) => {
  return (
    <Menu as='div' className='absolute flex right-0 mr-2 top-1/2 -translate-y-1/2 items-center z-[5] '>
      <Menu.Button className='rounded-[5px] text-darkGrey'>
        <DotsHorizontalIcon className='rounded-[3px] hover:bg-mediumGrey w-4 h-4 mx-0.25' />
      </Menu.Button>
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
            'font-normal absolute top-1/2 -translate-y-1/4 left-5 overflow-visible z-5 w-56 mt-2 bg-white rounded-md shadow-lg z-[5]'
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
