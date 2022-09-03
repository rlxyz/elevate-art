import { ConnectButton } from '@components/ConnectButton'
import { Link } from '@components/UI/Link'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import { Fragment, ReactNode } from 'react'

type HeaderInternalRoutesProp = {
  routes: {
    current: string
    options?: string[]
  }[]
}

const HeaderInternalRoutes = ({ routes }: HeaderInternalRoutesProp) => {
  if (!routes.length) return <></>
  return (
    <>
      {routes.map(({ current, options }, index) => {
        return (
          <>
            <Image
              priority
              width={30}
              height={30}
              src='/images/logo-slash.svg'
              alt='Logo Slash 1'
            />
            {options ? (
              <Popover className='relative'>
                <Popover.Button className='group inline-flex items-center rounded-[5px] text-xs focus:ring-offset-2'>
                  <span className='text-black text-xs font-semibold'>{current}</span>
                  <ChevronDownIcon className='ml-1 h-3 w-3' aria-hidden='true' />
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
                  <Popover.Panel className='absolute left-1/4 z-10 w-screen max-w-xs -translate-x-1/4 transform'>
                    <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5'>
                      <div className='p-2 relative bg-white'>
                        {options.map((item) => (
                          <Link
                            hover
                            pascalCase={false}
                            title={item}
                            enabled={item === current}
                            key={item}
                            href={item}
                          />
                        ))}
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            ) : (
              <Link href='#' className='' external={true}>
                <div className='text-darkGrey'>{current}</div>
              </Link>
            )}
          </>
        )
      })}
    </>
  )
}

const HeaderExternalaRoutes = ({
  routes,
  children,
}: {
  routes: { name: string; href: string }[]
  children: ReactNode
}) => {
  return (
    <div className='flex flex-row justify-center items-center space-x-3'>
      {routes && (
        <aside className='flex flex-row space-x-3'>
          {routes.map((item, index) => {
            return (
              <Link external={true} key={index} href={item.href}>
                <span className='cursor-pointer hover:text-black text-xs text-darkGrey'>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </aside>
      )}
      {children}
    </div>
  )
}

export const Header = ({
  children,
  internalRoutes = [],
  externalRoutes = [],
  connectButton = false,
}: {
  children?: ReactNode
  internalRoutes?: {
    current: string
    options?: string[]
  }[]
  externalRoutes?: { name: string; href: string }[]
  connectButton?: boolean
}) => {
  return (
    <header className='-ml-2 pointer-events-auto'>
      <div className='flex justify-between items-center h-[3.5rem]'>
        <div className='flex items-center text-xs font-semibold space-x-1'>
          <Link className='' external={true} href='/'>
            <Image priority width={50} height={50} src='/images/logo-black.png' alt='Logo' />
          </Link>
          <HeaderInternalRoutes routes={internalRoutes} />
        </div>
        <HeaderExternalaRoutes routes={externalRoutes}>
          {connectButton && <ConnectButton />}
        </HeaderExternalaRoutes>
      </div>
      {children}
    </header>
  )
}
