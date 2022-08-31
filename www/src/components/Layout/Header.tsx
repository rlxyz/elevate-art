import { ConnectButton } from '@components/ConnectButton'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { RepositoryNavbar } from '@components/CollectionHelpers/ViewContent'
import Link from 'next/link'
import { Button } from '@components/UI/Button'
import { Menu } from '@headlessui/react'

const navigation = [
  {
    name: 'Docs',
    href: 'https://docs.elevate.art',
  },
  {
    name: 'Discord',
    href: 'https://discord.elevate.art',
  },
]

export const Header = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionName: string = router.query.collection as string

  return (
    <header className='pointer-events-auto'>
      <div className='flex justify-between items-center h-[4.5rem]'>
        <div className='flex items-center text-xs font-semibold space-x-1'>
          <Image priority width={40} height={40} src='/images/logo-black.png' alt='Logo' />
          <Image priority width={20} height={20} src='/images/logo-slash.svg' alt='Logo Slash 1' />
          <span className='text-darkGrey'>{organisationName}</span>
          <Image priority width={20} height={20} src='/images/logo-slash.svg' alt='Logo Slash 2' />
          <span>{repositoryName}</span>
          <Image priority width={20} height={20} src='/images/logo-slash.svg' alt='Logo Slash 2' />
          <span>{collectionName}</span>
          {/* <Button onClick={() => console.log('test')} className=''>
            <Image width={15} height={15} src='/images/selector.svg' />
          </Button> */}
        </div>
        <div className='flex flex-row justify-center items-center space-x-6'>
          <div className='flex flex-row space-x-3'>
            {navigation.map((item, index) => {
              return (
                <Link key={index} href={item.href}>
                  <span className='text-xs font-semibold'>{item.name}</span>
                </Link>
              )
            })}
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
