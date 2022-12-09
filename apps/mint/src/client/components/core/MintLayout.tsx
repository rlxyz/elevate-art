import Image from 'next/image'
import React from 'react'

interface MintLayoutProps {
  children: React.ReactNode
}

export const MintLayout = ({ children }: MintLayoutProps) => {
  return <>{children}</>
}

interface MintLayoutHeaderProps {
  bannerImageUrl: string
  profileImageUrl: string
}

export const MintLayoutHeader: React.FC<MintLayoutHeaderProps> = ({ bannerImageUrl, profileImageUrl }) => {
  return (
    <>
      <div className='relative max-h-[300px] overflow-hidden'>
        <div className='h-[200px] md:h-0 pb-[25%]'>
          <div className='block absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border border-b border-mediumGrey'>
            <Image src={bannerImageUrl} alt='collection-banner' fill className='object-cover aspect-auto overflow-hidden' />
          </div>
        </div>
      </div>
      <div className='py-0 px-5 lg:px-16 2xl:px-32 w-full'>
        <div className='inline-flex -mt-16 md:-mt-28 mb-4 w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-[5px] basis-44 relative z-[1] border-2 border-mediumGrey bg-white'>
          <div className='block overflow-hidden absolute box-border m-0 inset-0'>
            <Image src={profileImageUrl} alt='collection-profile' fill className='object-cover aspect-auto overflow-hidden rounded-[5px]' />
          </div>
        </div>
      </div>
    </>
  )
}

MintLayout.Header = MintLayoutHeader
MintLayout.Body = () => <></>
