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

const LayoutContainer = ({
  className,
  children,
  hasBorder = true,
}: {
  hasBorder?: boolean
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div className={clsx('flex justify-center', className, hasBorder && 'border-b border-mediumGrey')}>
      <div className='w-[90%] lg:w-[75%] 2xl:w-[70%] 3xl:w-[50%]'>{children}</div>
    </div>
  )
}

export const Layout = ({ children, hasFooter = true }: LayoutProps) => {
  return (
    <main className='layout'>
      {children}
      {hasFooter ? (
        <LayoutContainer>
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
    <div className='-ml-2'>{<DynamicHeader {...props} />}</div>
  </LayoutContainer>
)

const LayoutBody = ({ children, hasBorder = true }: { children: React.ReactNode; hasBorder?: boolean }) => (
  <LayoutContainer className='body min-h-[calc(100vh-7rem)]' hasBorder={hasBorder}>
    <div className='py-8 -ml-2 h-full space-y-8'>{children}</div>
  </LayoutContainer>
)

const LayoutTitle = ({ children }: { children: React.ReactNode }) => (
  <LayoutContainer className='title'>{children}</LayoutContainer>
)

Layout.Header = LayoutHeader
Layout.Title = LayoutTitle
Layout.Body = LayoutBody
