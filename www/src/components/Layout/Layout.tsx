import { classNames } from '@utils/format'
import * as React from 'react'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const LayoutContainer = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div className={classNames('flex justify-center border-b border-mediumGrey', className || '')}>
      <div className='w-[90%] lg:w-[75%] xl:[82%] 2xl:w-[65%]'>{children}</div>
    </div>
  )
}

export const Layout = ({ children }: { children: React.ReactElement[] }) => {
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
  <LayoutContainer className='header'>{children}</LayoutContainer>
)

const LayoutBody = ({ children }: { children: React.ReactNode }) => (
  <LayoutContainer className='body'>{children}</LayoutContainer>
)

const LayoutTitle = ({ children }: { children: React.ReactNode }) => (
  <LayoutContainer className='title'>{children}</LayoutContainer>
)

Layout.Header = LayoutHeader
Layout.Title = LayoutTitle
Layout.Body = LayoutBody
