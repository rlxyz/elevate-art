import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'
import NextLinkComponent from './NextLink'

interface NextLinkWithHoverHueComponentProps {
  children: React.ReactNode
  href: string
  enabled: boolean
}

export const NextLinkWithHoverHueComponent: FC<NextLinkWithHoverHueComponentProps> = ({
  children,
  href,
  enabled,
}: {
  children: React.ReactNode
  href: string
  enabled: boolean
}) => {
  return (
    <NextLinkComponent href={href}>
      <div className={clsx(enabled && 'font-semibold', 'hover:bg-lightGray py-2')}>
        <span className='px-5 flex flex-row items-center text-black justify-between text-xs w-full'>{children}</span>
      </div>
    </NextLinkComponent>
  )
}
