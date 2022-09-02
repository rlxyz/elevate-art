import { ConnectButton } from '@components/ConnectButton'
import Image from 'next/image'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'

const navigation = [
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
]

export const BasicHeader = ({ navigation }: { navigation: { name: string; href: string }[] }) => {
  return (
    <header className='-ml-2 pointer-events-auto'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center text-xs font-semibold space-x-1'>
          <Link href='/'>
            <Image priority width={50} height={50} src='/images/logo-black.png' alt='Logo' />
          </Link>
        </div>
        <div className='flex flex-row justify-center items-center space-x-3'>
          <aside className='flex flex-row space-x-3'>
            {navigation.map((item, index) => {
              return (
                <Link key={index} href={item.href}>
                  <span className='cursor-pointer hover:text-black text-xs text-darkGrey'>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </aside>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

export const Header = ({ navigation }: { navigation: { name: string; href: string }[] }) => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionName: string = router.query.collection as string

  return (
    <header className='-ml-2 pointer-events-auto'>
      <div className='flex justify-between items-center h-[3.5rem]'>
        <div className='flex items-center text-xs font-semibold space-x-1'>
          <Link href='/'>
            <Image priority width={50} height={50} src='/images/logo-black.png' alt='Logo' />
          </Link>
          <Image priority width={30} height={30} src='/images/logo-slash.svg' alt='Logo Slash 1' />
          <span className='text-darkGrey'>{organisationName}</span>
          <Image priority width={30} height={30} src='/images/logo-slash.svg' alt='Logo Slash 2' />
          <span>{repositoryName}</span>
          <Image priority width={30} height={30} src='/images/logo-slash.svg' alt='Logo Slash 2' />
          <span>{collectionName}</span>
          {/* <Button onClick={() => console.log('test')} className=''>
            <Image width={15} height={15} src='/images/selector.svg' />
          </Button> */}
        </div>
        <div className='flex flex-row justify-center items-center space-x-3'>
          <aside className='flex flex-row space-x-3'>
            {navigation.map((item, index) => {
              return (
                <Link key={index} href={item.href}>
                  <span className='cursor-pointer hover:text-black text-xs text-darkGrey'>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </aside>
          <ConnectButton />
        </div>
      </div>
      {children}
    </header>
  )
}
