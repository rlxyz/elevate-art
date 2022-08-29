import { ConnectButton } from '@components/ConnectButton'
import useRepositoryStore from '@hooks/useRepositoryStore'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'

export const Header = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string

  return (
    <header className='w-full flex bg-white justify-between h-[5rem] px-4 lg:py-8 lg:px-8 pointer-events-auto border-b border-b-lightGray items-center'>
      <div className='flex'>
        <Image priority width={25} height={25} src='/images/logo.svg' alt='Logo' />
        <div className='mt-2 ml-4 font-bold'>
          <span className='pr-2 text-darkGrey'>{`${organisationName}`}</span>
          <span className='pr-2 text-darkGrey'>/</span>
          <span>{repositoryName && repositoryName}</span>
        </div>
      </div>
      <div className='ml-4 md:block flex justify-center space-x-6 md:order-2'>
        <ConnectButton />
      </div>
    </header>
  )
}
