import Image from 'next/image'

export const BannerDisplay = ({ src }: { src?: string | null }) => {
  return (
    <div className='h-72 w-screen'>
      <div className='h-72 w-screen absolute left-0 border border-mediumGrey'>
        <div className='flex items-center justify-center absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border h-full w-full'>
          <div className='block overflow-hidden absolute box-border m-0 rounded-[5px] bg-lightGray animate-pulse-gradient-infinite inset-0'>
            {src && <Image src={src} alt='banner-image' width={2800} height={800} className='block object-cover m-auto overflow-hidden' />}
          </div>
        </div>
      </div>
    </div>
  )
}
