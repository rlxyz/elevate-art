import { ConnectButton } from '@components/UI/ConnectButton'
import { Link } from '@components/UI/Link'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const DynamicHeaderExternalRoutes = dynamic(() => import('./HeaderExternalRoutes'), {
  suspense: true,
  ssr: false,
})

const DynamicHeaderInternalPageRoutes = dynamic(() => import('./HeaderInternalPageRoutes'), {
  suspense: true,
})

const DynamicHeaderInternalRoutes = dynamic(() => import('./HeaderInternalAppRoutes'), {
  suspense: true,
})

export interface HeaderProps {
  internalRoutes?: {
    current: string
    href: string
    options?: string[]
  }[]
  connectButton?: boolean
  internalNavigation?: { name: string; enabled: boolean; href?: string; forceDisabled?: boolean }[]
}

const Header = ({ internalRoutes = [], internalNavigation = [], connectButton = false }: HeaderProps) => {
  return (
    <header className='pointer-events-auto'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center text-xs font-semibold space-x-1'>
          <Link className='' external={true} href='/'>
            <Image priority width={50} height={50} src='/images/logo-black.png' alt='Logo' />
          </Link>
          <DynamicHeaderInternalRoutes routes={internalRoutes} />
        </div>
        <DynamicHeaderExternalRoutes>{connectButton && <ConnectButton />}</DynamicHeaderExternalRoutes>
      </div>
      {internalNavigation && <DynamicHeaderInternalPageRoutes links={internalNavigation} />}
    </header>
  )
}

export default Header
