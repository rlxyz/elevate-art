import clsx from 'clsx'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { Toaster } from 'react-hot-toast'
import type { HeaderProps } from '../header/Header'
import Header from '../header/Header'

const DynamicHeader = dynamic(() => import('../header/Header'))
const DynamicFooter = dynamic(() => import('./Footer'))

interface LayoutProps {
  children: React.ReactElement[] | React.ReactElement
  hasFooter?: boolean
}

export const LayoutContainer = ({
  className,
  children,
  border = 'lower',
}: {
  border?: 'upper' | 'lower' | 'none'
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={clsx(
        'flex justify-center h-full w-full',
        className,
        border === 'lower' && 'border-b border-mediumGrey',
        border === 'upper' && 'border-t border-mediumGrey'
      )}
    >
      <div className='w-[90%] lg:w-[70%] 2xl:w-[75%] 3xl:w-[65%] h-full'>{children}</div>
    </div>
  )
}

export const Layout = ({ children, hasFooter = true }: LayoutProps) => {
  return (
    <main className='layout'>
      {children}
      {hasFooter ? (
        <LayoutContainer border='upper'>
          <div className='min-h-[3.5rem] flex items-center'>
            <DynamicFooter />
          </div>
        </LayoutContainer>
      ) : (
        <></>
      )}
      <Toaster />
    </main>
  )
}

const LayoutHeader = (props: HeaderProps) => (
  <LayoutContainer className='header min-h-[3.5rem] max-h-[5.64rem]'>
    <div className='-ml-2'>
      <Header {...props} />
    </div>
  </LayoutContainer>
)

const LayoutBody = ({
  children,
  border = 'none',
}: {
  children: React.ReactNode[] | React.ReactNode
  border?: 'upper' | 'lower' | 'none'
}) => {
  const childrens = React.Children.toArray(children)
  return (
    <div className='min-h-[calc(100vh-7.14rem)]'>
      <div className='h-full w-screen'>
        {childrens.map((child, index) => {
          return (
            <LayoutContainer border={border} key={index}>
              <div className='-ml-2 h-full w-full space-y-8'>{child}</div>
            </LayoutContainer>
          )
        })}
      </div>
    </div>
  )
}

const LayoutTitle = ({ children }: { children: React.ReactNode }) => <LayoutContainer className='title'>{children}</LayoutContainer>

Layout.Header = LayoutHeader
Layout.Title = LayoutTitle
Layout.Body = LayoutBody
