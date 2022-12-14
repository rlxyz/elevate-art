import { Popover, Transition } from '@headlessui/react'
import { SelectorIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import Image from 'next/image'
import type { FC, PropsWithChildren } from 'react'
import { Children, Fragment, useState } from 'react'
import { TriangleIcon } from '../icons/RectangleGroup'
import { default as NextLinkComponent } from '../link/NextLink'
import SearchComponent from '../search/Search'

type Props = {
  children: React.ReactElement[] | React.ReactElement
}

type AppRoutesNavbarProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

const AppRoutesNavbar: FC<PropsWithChildren<AppRoutesNavbarProps>> = ({ children }: AppRoutesNavbarProps) => {
  const childrens = Children.toArray(children)
  return (
    <>
      {childrens.map((child, index) => {
        return (
          <div key={index} className='flex items-center justify-center'>
            <Image priority width={30} height={30} src='/images/logo-slash.svg' alt='Logo Slash 1' />
            <div>{child}</div>
          </div>
        )
      })}
    </>
  )
}

export const ZoneRoutesNavbarPopover: FC = () => {
  const [query, setQuery] = useState('')
  const zoneRoutes = [
    { label: 'Explore', href: '/explore', selected: false },
    { label: 'Create', href: '/create', selected: true },
  ]
  const filteredZoneRoutes = zoneRoutes.filter((zoneRoute) => zoneRoute.label.toLowerCase().includes(query.toLowerCase()))
  return (
    <Popover className='flex space-x-1'>
      <Popover.Button className='group inline-flex items-center rounded-[5px] text-xs'>
        <SelectorIcon className='text-black w-4 h-4' />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-1'
      >
        <Popover.Panel className='absolute z-10 w-fit -translate-x-1/4 py-6 max-w-xs'>
          <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5'>
            <div className='relative bg-lightGray rounded-[5px]'>
              <SearchComponent
                onChange={(e) => {
                  setQuery(e.target.value)
                }}
                className='rounded-t-[5px] rounded-b-[0px] border-t-0 border-l-0 border-r-0 border-b focus:border-mediumGrey'
              />
              <div className='p-2 relative bg-white space-y-1'>
                <span className='text-darkGrey text-[0.6rem]'>Apps</span>
                <div>
                  {filteredZoneRoutes.map((item) => (
                    <NextLinkComponent
                      key={item.label}
                      href={item.href}
                      className={clsx(
                        item.selected && 'hover:bg-mediumGrey',
                        'flex space-x-3 items-center w-full p-2 rounded-[3px] hover:bg-mediumGrey'
                      )}
                    >
                      <TriangleIcon className='w-3 h-3' />
                      <span className='text-[0.7rem] font-normal'>{item.label}</span>
                    </NextLinkComponent>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

const AppRoutesNavbarItem: FC<PropsWithChildren<{ children?: React.ReactNode; label: string; href: string }>> = ({
  children,
  label,
  href,
}) => (
  <div className='flex space-x-1'>
    <NextLinkComponent href={href} className='w-fit'>
      <span className='text-xs'>{label}</span>
    </NextLinkComponent>
    {children}
  </div>
)

export type AppRoutesNavbarPopoverType = typeof AppRoutesNavbar & {
  Item: typeof AppRoutesNavbarItem
}
;(AppRoutesNavbar as AppRoutesNavbarPopoverType).Item = AppRoutesNavbarItem

export default AppRoutesNavbar as AppRoutesNavbarPopoverType
