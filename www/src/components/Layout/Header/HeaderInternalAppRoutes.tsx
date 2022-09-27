import { Link } from '@components/UI/Link'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import { Fragment } from 'react'

type HeaderInternalAppRoutesProps = {
  routes: {
    current: string
    href: string
    options?: string[]
  }[]
}
const HeaderInternalAppRoutes = ({ routes }: HeaderInternalAppRoutesProps) => {
  if (!routes.length) return <></>
  return (
    <>
      {routes.map(({ current, href, options }, index) => {
        return (
          <div key={index} className='flex items-center justify-center'>
            <Image priority width={30} height={30} src='/images/logo-slash.svg' alt='Logo Slash 1' />
            <div className='space-x-1 flex'>
              <Link href={href} enabled={false} external>
                <div className={clsx(options ? 'text-black' : 'text-darkGrey')}>{current}</div>
              </Link>
              {options ? (
                <Popover className='relative'>
                  <Popover.Button className='group inline-flex items-center rounded-[5px] text-xs'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      className='w-4 h-4 text-black'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
                      />
                    </svg>
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
                            <Link hover title={item} enabled={item === current} key={item} href={item} />
                          ))}
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              ) : (
                <></>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default HeaderInternalAppRoutes
