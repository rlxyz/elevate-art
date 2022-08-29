import { RepositoryNavbar } from '@components/CollectionHelpers/ViewContent'
import * as React from 'react'
import * as z from 'zod'
import { Header } from './Header'
import { SectionHeader } from '../CollectionHelpers/SectionHeader'
import { Seo } from './Seo'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Seo />
      <main>
        <div className='bg-hue-header flex justify-center border border-b border-lightGray'>
          <div className='w-[70%]'>
            <Header />
            <RepositoryNavbar />
          </div>
        </div>
        <div className='bg-hue-light flex justify-center border border-b border-lightGray'>
          <div className='w-[70%]'>
            <SectionHeader />
          </div>
        </div>
        <div className='bg-hue-light flex justify-center'>{children}</div>
      </main>
    </>
  )
}
