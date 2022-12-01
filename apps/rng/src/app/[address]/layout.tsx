import Image from 'next/image'
import Link from 'next/link'
import MainSearch from '../main-search'

export default function AddressLayout({
  children,
  params: { address },
}: {
  children: React.ReactNode
  params: { address: string }
}) {
  return (
    <div>
      <div className='text-foreground border-border flex flex-row justify-between border-b border-b px-6 py-3'>
        <Link href='/'>
          <Image priority src='/images/logo-white.png' width={50} height={50} alt='logo-header' />
        </Link>
        <div className='w-1/2'>
          <MainSearch />
        </div>
      </div>
      <div className='grid grid-cols-4 gap-6 p-6'>
        {/* <div className='space-y-6'>
          <Card className='col-span-3 row-span-1 text-foreground text-xs flex flex-col space-y-1'>
            <label className='text-xs text-accents_6'>Address</label>
            <span className='text-accents_3'>{address}</span>
          </Card>
          <Card className='col-span-2 text-foreground text-xs flex flex-col space-y-1'>
            <label className='text-xs text-accents_6'>Address</label>
            <span className='text-accents_3'>{address}</span>
          </Card>
        </div> */}
        <div className='col-span-4'>{children}</div>
      </div>
    </div>
  )
}
