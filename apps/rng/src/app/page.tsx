import Image from 'next/image'
import Link from 'next/link'
import MainSearch from './main-search'
import R3FCanvas from './r3f-canvas'

export default async function Home() {
  return (
    <div className='w-full h-full border-b border-accents_7'>
      <R3FCanvas />
      <div className='absolute top-[40vh] -translate-y-1/2 left-4'>
        <div className='border border-border bg-background p-1 hover:border-success rounded-tertiary'>
          <Link href='https://elevate.art'>
            <Image src='/images/logo-white.png' width={50} height={50} alt='logo-left' />
          </Link>
        </div>
      </div>
      <div className='absolute top-[40vh] -translate-y-1/2 right-4'>
        <div className='border border-border bg-background p-1 hover:border-success rounded-tertiary'>
          <Link href='https://elevate.art'>
            <Image src='/images/logo-white.png' width={50} height={50} alt='logo-right' />
          </Link>
        </div>
      </div>
      <div className='absolute top-[40%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-screen flex justify-center'>
        <div className='w-1/2'>
          <div className='max-w-7xl mx-auto'>
            <MainSearch />
          </div>
        </div>
      </div>
    </div>
  )
}
