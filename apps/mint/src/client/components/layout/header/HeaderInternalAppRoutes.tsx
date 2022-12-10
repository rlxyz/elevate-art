import { Popover } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'

import { default as NextLinkComponent } from '../link/NextLink'

type HeaderInternalAppRoutesProps = {
  routes: {
    current: string
    href: string
  }[]
}

export const HeaderInternalAppRoutes = ({ routes }: HeaderInternalAppRoutesProps) => {
  return (
    <>
      {routes.map(({ current, href }, index) => {
        return (
          <div key={index} className='flex items-center justify-center'>
            <Image priority width={30} height={30} src='/images/logo-slash.svg' alt='Logo Slash 1' />
            <Popover className='flex space-x-1'>
              <NextLinkComponent href={href} className='w-fit'>
                <div className={clsx('text-black', 'py-1')}>{current}</div>
              </NextLinkComponent>
            </Popover>
          </div>
        )
      })}
    </>
  )
}
