import clsx from 'clsx'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { Toaster } from 'react-hot-toast'
import { HeaderProps } from './Header/Index'

const DynamicHeader = dynamic(() => import('./Header/Index'), {
  suspense: true,
  ssr: false,
})

const DynamicFooter = dynamic(() => import('./Footer'), {
  ssr: false,
  suspense: true,
})

interface LayoutProps {
  children: React.ReactElement[] | React.ReactElement
  hasFooter?: boolean
}

export const LayoutContainer = ({
  className,
  children,
  border = 'lower',
}: {
  border?: 'upper' | 'lower'
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={clsx(
        'flex justify-center',
        className,
        border === 'lower' && 'border-b border-mediumGrey',
        border === 'upper' && 'border-t border-mediumGrey'
      )}
    >
      <div className='w-[90%] lg:w-[75%] 2xl:w-[70%] 3xl:w-[50%]'>{children}</div>
    </div>
  )
}

export const Layout = ({ children, hasFooter = true }: LayoutProps) => {
  return (
    <main className='layout'>
      {children}
      {hasFooter ? (
        <LayoutContainer border='upper'>
          <DynamicFooter />
        </LayoutContainer>
      ) : (
        <></>
      )}
      <Toaster />
    </main>
  )
}

const LayoutHeader = (props: HeaderProps) => (
  <LayoutContainer className='header min-h-[3.5rem]'>
    <div className='-ml-2'>{<DynamicHeader connectButton {...props} />}</div>
  </LayoutContainer>
)

const LayoutBody = ({ children, hasBorder = true }: { children: React.ReactNode[] | React.ReactNode; hasBorder?: boolean }) => {
  const childrens = React.Children.toArray(children)

  return (
    <main className='min-h-[calc(100vh-19.25rem)] py-8'>
      {childrens.map((child, index) => {
        return (
          <LayoutContainer key={index}>
            <div className='-ml-2 h-full space-y-8'>{child}</div>
          </LayoutContainer>
        )
      })}
    </main>
  )
}

const LayoutTitle = ({ children }: { children: React.ReactNode }) => (
  <LayoutContainer className='title'>{children}</LayoutContainer>
)

Layout.Header = LayoutHeader
Layout.Title = LayoutTitle
Layout.Body = LayoutBody
