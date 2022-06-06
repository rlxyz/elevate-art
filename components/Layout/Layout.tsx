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
      <div className="absolute top-0 left-0 h-full w-full pointer-events-auto">
        <main className="w-full h-full flex justify-center items-center">
          <div className={`w-full h-full relative flex justify-center items-center`}>
            <Header />
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
