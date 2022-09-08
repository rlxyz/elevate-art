import { classNames } from '@utils/format'
import * as React from 'react'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactElement[] | React.ReactElement
}

const LayoutContainer = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={classNames('flex justify-center border-b border-mediumGrey', className || '')}>
      <div className='w-[90%] lg:w-[75%] xl:[82%] 2xl:w-[65%]'>{children}</div>
    </div>
  )
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <main className='layout'>
      {children}
      <LayoutContainer>
        <Footer />
      </LayoutContainer>
    </main>
  )
}

const LayoutHeader = ({ children }: { children: React.ReactNode }) => (
  <LayoutContainer className='header'>
    <div className='-ml-2'>{children}</div>
  </LayoutContainer>
)

const LayoutBody = ({ children }: { children: React.ReactNode }) => (
  <LayoutContainer className='body min-h-[calc(100vh-10rem)]'>
    <div className='py-8 -ml-2'>{children}</div>
  </LayoutContainer>
)

const LayoutTitle = ({ children }: { children: React.ReactNode }) => (
  <LayoutContainer className='title'>{children}</LayoutContainer>
)

Layout.Header = LayoutHeader
Layout.Title = LayoutTitle
Layout.Body = LayoutBody
