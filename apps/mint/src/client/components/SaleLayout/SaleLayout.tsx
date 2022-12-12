import clsx from 'clsx'

import type { ReactNode } from 'react'
import React from 'react'
import { SaleLayoutBody } from './SaleLayoutBody'
import { SaleLayoutFooter } from './SaleLayoutFooter'
import { SaleLayoutHeader } from './SaleLayoutHeader'

interface Props {
  className?: string
}

const SaleLayoutContainer = ({ children }: { children: ReactNode }) => {
  return <div className='p-4'>{children}</div>
}

export type SaleLayoutProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

export const SaleLayout = ({ children, className, ...props }: SaleLayoutProps) => {
  const childrens = React.Children.toArray(children)

  return (
    <form
      className={clsx(
        className,
        'bg-background transition-all rounded-[5px] box-border border border-mediumGrey divide-y divide-mediumGrey h-fit w-full'
      )}
      {...props}
    >
      {childrens.map((child, index) => {
        return <SaleLayoutContainer key={index}>{child}</SaleLayoutContainer>
      })}
    </form>
  )
}

SaleLayout.Body = SaleLayoutBody
SaleLayout.Header = SaleLayoutHeader
SaleLayout.Footer = SaleLayoutFooter
