import Image from 'next/image'
import { ConnectButton } from '../eth/ConnectButton'
import LinkComponent from '../link/Link'
import { default as NextLink, default as NextLinkComponent } from '../link/NextLink'

const externalRoutes = [
  {
    name: 'Docs',
    href: 'https://docs.elevate.art',
  },
  {
    name: 'Features',
    href: 'https://feature.elevate.art',
  },
]

const HeaderExternalRoutes = ({ authenticated }: { authenticated: boolean }) => {
  return (
    <div className='flex flex-row justify-center items-center space-x-3'>
      <aside className='flex flex-row items-center justify-center space-x-3'>
        {externalRoutes.map((item) => {
          return (
            <LinkComponent key={item.name} href={item.href} rel='noreferrer nofollow' target='_blank'>
              <span className='cursor-pointer hover:text-black text-xs text-darkGrey' aria-hidden='true'>
                {item.name}
              </span>
            </LinkComponent>
          )
        })}
      </aside>
      {authenticated ? (
        <ConnectButton />
      ) : (
        <NextLink href='/connect'>
          <span className='w-fit cursor-pointer h-fit bg-black rounded-full text-white text-xs p-2'>Connect</span>
        </NextLink>
      )}
    </div>
  )
}

export interface HeaderProps {
  authenticated?: boolean
  children?: React.ReactNode
}

const Index = ({ authenticated = true, children }: HeaderProps) => {
  return (
    <header className='pointer-events-auto'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center text-xs font-semibold space-x-1 w-fit'>
          <NextLinkComponent className='w-fit' href='/'>
            <Image priority width={50} height={50} src='/images/logo-black.png' alt='Logo' />
          </NextLinkComponent>
          {children}
        </div>
        <div>{/* <Search /> */}</div>
        <HeaderExternalRoutes authenticated={authenticated} />
      </div>
    </header>
  )
}

export default Index
