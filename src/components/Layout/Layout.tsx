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
      <main>
        <Header />
        {children}
        {/* <Footer /> */}
      </main>
    </>
  )
}
