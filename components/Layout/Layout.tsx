import * as React from 'react'

import { Header } from './Header'
import { Seo } from './Seo'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Seo />
      <main className="max-h-screen">
        <div className="p-0 2xl:px-24 2xl:mt-14 4xl:p-48">
          <div className="shadow-none 2xl:shadow-md 4xl:shadow-lg">
            <Header />
            {children}
          </div>
        </div>
      </main>
    </>
  )
}
