import { ConnectButton } from '@components/ConnectButton'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { RepositoryNavbar } from '@components/CollectionHelpers/ViewContent'

export const Header = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string

  return (
    <header className='pointer-events-auto'>
      <div className='flex justify-between items-center h-[5rem]'>
        <div className='flex items-center text-xs font-semibold space-x-1'>
          <Image priority width={40} height={40} src='/images/logo-transparent.png' alt='Logo' />
          <Image priority width={20} height={20} src='/images/logo-slash.svg' alt='Logo Slash 1' />
          <span className='text-darkGrey'>{organisationName}</span>
          <Image priority width={20} height={20} src='/images/logo-slash.svg' alt='Logo Slash 2' />
          <span>{repositoryName}</span>
        </div>
        <div className='ml-4 md:block flex justify-center space-x-6 md:order-2'>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
