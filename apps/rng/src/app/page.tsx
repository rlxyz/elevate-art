import Image from 'next/image'
import Link from 'next/link'
import MainSearch from './main-search'
import R3FCanvas from './r3f-canvas'

export default async function Home() {
  return (
    <div className='border-accents_7 h-full w-full border-b'>
      <R3FCanvas />
      <div className='absolute top-1/2 left-4 -translate-y-1/2'>
        <div className='border-border bg-background hover:border-success rounded-tertiary border p-1'>
          <Link href='https://elevate.art'>
            <Image src='/images/logo-white.png' width={50} height={50} alt='logo-left' />
          </Link>
        </div>
      </div>
      <div className='absolute top-1/2 right-4 -translate-y-1/2'>
        <div className='border-border bg-background hover:border-success rounded-tertiary border p-1'>
          <Link href='https://elevate.art'>
            <Image src='/images/logo-white.png' width={50} height={50} alt='logo-right' />
          </Link>
        </div>
      </div>
      <div className='absolute top-1/2 left-1/2 flex w-screen -translate-y-1/2 -translate-x-1/2 justify-center'>
        <div className='flex w-full flex-col items-center'>
          <div className='w-1/2'>
            <div className='mx-auto max-w-7xl'>
              <MainSearch />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
