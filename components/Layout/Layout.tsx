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
        <div className="p-0 2xl:px-28 3xl:py-12 3xl:px-44 4xl:px-[36rem] 4xl:py-48">
          <div className="shadow-none 2xl:shadow-md 4xl:shadow-lg">
            <Header />
            {children}
          </div>
        </div>
      </main>
    </>
  )
}
