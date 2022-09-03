import { RepositoryNavbar } from '@components/CollectionHelpers/RepositoryNavbar'
import { useRouter } from 'next/router'
import * as React from 'react'
import { SectionHeader } from '../CollectionHelpers/SectionHeader'
import { Footer } from './Footer'
import { Header } from './Header'
import { Seo } from './Seo'

const externalRoutes = [
  {
    name: 'Blog',
    href: 'https://blog.art',
  },
  {
    name: 'Docs',
    href: 'https://docs.elevate.art',
  },
  {
    name: 'Discord',
    href: 'https://discord.elevate.art',
  },
]

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
            <Header externalRoutes={externalRoutes} />
          </div>
        </div>
        <div className='bg-hue-light flex justify-center min-h-[calc(100vh-8rem)]'>
          <div className='w-[90%] lg:w-[75%] xl:[82%] 2xl:w-[65%]'>{children}</div>
        </div>
        <div className='bg-hue-light flex justify-center border border-t border-mediumGrey h-[4.5rem]'>
          <div className='w-[90%] lg:w-[75%] xl:[82%] 2xl:w-[65%]'>
            <Footer />
          </div>
        </div>
      </main>
    </>
  )
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const repositoryName = router.query.repository as string
  const collectionName = router.query.collection as string

  return (
    <>
      <Seo />
      <main>
        <div className='bg-hue-light flex justify-center'>
          <div className='w-[90%] lg:w-[75%] xl:[82%] 2xl:w-[65%]'>
            <Header
              internalRoutes={[
                { current: organisationName },
                { current: repositoryName },
                { current: collectionName, options: ['main', 'development'] },
              ]}
              externalRoutes={[
                {
                  name: 'Changelog',
                  href: 'https://changelog.elevate.art',
                },
                {
                  name: 'Docs',
                  href: 'https://docs.elevate.art',
                },
                {
                  name: 'Discord',
                  href: 'https://discord.elevate.art',
                },
              ]}
            >
              <RepositoryNavbar />
            </Header>
          </div>
        </div>
        <div className='bg-hue-light flex justify-center border border-b border-mediumGrey'>
          <div className='w-[90%] lg:w-[75%] xl:[82%] 2xl:w-[65%]'>
            <SectionHeader />
          </div>
        </div>
        <div className='bg-hue-light flex justify-center'>
          <div className='w-[90%] lg:w-[75%] xl:[82%]  2xl:w-[65%]'>{children}</div>
        </div>
        <div className='bg-hue-light flex justify-center border border-t border-mediumGrey'>
          <div className='w-[90%] lg:w-[75%] xl:[82%]  2xl:w-[65%]'>
            <Footer />
          </div>
        </div>
      </main>
    </>
  )
}
