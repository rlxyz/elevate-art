import { Popover, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import Image from 'next/image'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { Children, Fragment, useState } from 'react'
import { default as NextLinkComponent } from '../link/NextLink'
import { LoadingBar } from '../loading/LoadingBar'
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

export const ZoneRoutesNavbarPopover: FC<{
  title: string
  routes: { label: string; href: string; selected: boolean; icon: (props: any) => JSX.Element }[]
}> = ({ routes, title }) => {
  const [query, setQuery] = useState('')
  const filteredZoneRoutes = routes.filter((zoneRoute) => zoneRoute.label.toLowerCase().includes(query.toLowerCase()))
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
        <Popover.Panel className='absolute z-10 w-92 -translate-x-1/4 py-6 max-w-sm'>
          <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5'>
            <div className='relative bg-lightGray rounded-[3px]'>
              <SearchComponent
                onChange={(e) => {
                  setQuery(e.target.value)
                }}
                className='rounded-t-[5px] rounded-b-[0px] border-t-0 border-l-0 border-r-0 border-b focus:border-mediumGrey'
              />
              <div className='p-2 relative bg-white space-y-1'>
                <span className='text-darkGrey text-[0.6rem]'>{title}</span>
                <div>
                  {filteredZoneRoutes.map((item) => (
                    <NextLinkComponent
                      key={item.label}
                      href={item.href}
                      className={clsx('hover:bg-mediumGrey', 'flex justify-between p-2 rounded-[3px] items-center')}
                    >
                      <div className='flex space-x-3 items-center w-full'>
                        <item.icon className='w-3 h-3' />
                        <span className='text-[0.7rem] font-normal'>{item.label}</span>
                      </div>
                      {item.selected && <CheckIcon className='w-4 h-4 text-darkGrey' />}
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

const AppRoutesNavbarItem: FC<
  PropsWithChildren<{ children?: ReactNode; label: string | ReactNode; href: string; loading?: boolean; disabled?: boolean }>
> = ({ children, label, href, loading = false, disabled = false }) => (
  <div className='flex space-x-1'>
    {loading ? (
      <LoadingBar />
    ) : (
      <>
        {disabled ? (
          <span className='text-darkGrey'>{label}</span>
        ) : (
          <div className='flex space-x-1 items-center'>
            <NextLinkComponent aria-disabled={disabled} href={href} className='w-fit'>
              <span className='text-xs'>{label}</span>
            </NextLinkComponent>
            {children}
          </div>
        )}
      </>
    )}
  </div>
)

export type AppRoutesNavbarPopoverType = typeof AppRoutesNavbar & {
  Item: typeof AppRoutesNavbarItem
}
;(AppRoutesNavbar as AppRoutesNavbarPopoverType).Item = AppRoutesNavbarItem

export default AppRoutesNavbar as AppRoutesNavbarPopoverType
