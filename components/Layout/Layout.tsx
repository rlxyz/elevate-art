import dynamic from 'next/dynamic'
import * as React from 'react'

import { Footer } from './Footer'
import { Seo } from './Seo'

// todo: unsure why ssr is not working
const Header = dynamic(() => import('./Header').then((mod) => mod.Header), {
  ssr: false,
})

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
