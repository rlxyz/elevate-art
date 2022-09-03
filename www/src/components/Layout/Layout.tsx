import { classNames } from '@utils/format'
import * as React from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { Seo } from './Seo'

interface LayoutProps {
  children: React.ReactNode
}

export const BasicLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Seo />
      <main>
        <div className='bg-hue-light flex justify-center border-b border-mediumGrey h-[3.5rem]'>
          <div className='w-[90%] lg:w-[75%] xl:[82%] 2xl:w-[65%]'>
            <Header />
          </div>
        </div>
        <div className='bg-hue-light flex justify-center min-h-[calc(100vh-8rem)]'>
          <div className='w-[90%] lg:w-[75%] xl:[82%] 2xl:w-[65%]'>{children}</div>
        </div>
        <div className='bg-hue-light flex justify-center border border-t border-mediumGrey '>
          <div className='w-[90%] lg:w-[75%] xl:[82%] 2xl:w-[65%]'>
            <Footer />
          </div>
        </div>
      </main>
    </>
  )
}

const LayoutContainer = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={classNames(
        'flex justify-center border border-b border-mediumGrey',
        className || ''
      )}
    >
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

Layout.Header = LayoutHeader
Layout.Body = LayoutBody
