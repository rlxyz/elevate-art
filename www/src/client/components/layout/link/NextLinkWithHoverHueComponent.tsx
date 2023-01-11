import clsx from 'clsx'
import type { FC, ReactNode } from 'react'
import React from 'react'
import NextLinkComponent from './NextLink'

interface NextLinkWithHoverHueComponentProps {
  children: React.ReactNode
  href: string
  enabled: boolean
  disabled?: boolean
}

const HoverHueComponentText = ({ children }: { children: ReactNode }) => {
  return (
    <div className='py-2'>
      <span className='px-5 flex flex-row items-center text-black justify-between text-xs w-full'>{children}</span>
    </div>
  )
}

export const NextLinkWithHoverHueComponent: FC<NextLinkWithHoverHueComponentProps> = ({
  children,
  href,
  enabled,
  disabled = false,
}: {
  children: React.ReactNode
  href: string
  enabled: boolean
  disabled?: boolean
}) => {
  return (
    <div className={clsx(enabled && 'font-semibold', 'hover:bg-lightGray w-full rounded-[3px]')}>
      {disabled ? (
        <HoverHueComponentText>
          <div className='cursor-not-allowed w-full'>{children}</div>
        </HoverHueComponentText>
      ) : (
        <>
          <NextLinkComponent href={href}>
            <HoverHueComponentText>{children}</HoverHueComponentText>
          </NextLinkComponent>
        </>
      )}
    </div>
  )
}
