import * as React from 'react'

import { Footer } from './Footer'
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
        <div>
          <div className="shadow-none 2xl:shadow-md 4xl:shadow-lg">
            <Header />
            {children}
            <Footer />
          </div>
        </div>
      </main>
    </>
  )
}
