import Image from 'next/image'
import React from 'react'

interface ProjectHeaderProps {
  bannerImageUrl: string
  profileImageUrl: string
  projectOwner: string
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ bannerImageUrl, profileImageUrl, projectOwner }) => {
  return (
    <>
      <div className='relative max-h-[300px] overflow-hidden'>
        <div className='h-[200px] md:h-0 pb-[25%]'>
          <div className='block absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border border-b border-mediumGrey'>
            <Image src={'/images/moonbirds-banner.png'} alt='Project Banner' fill className='object-cover aspect-auto overflow-hidden' />
          </div>
        </div>
      </div>
      <div className='py-0 px-5 lg:px-16 2xl:px-32 w-full'>
        <div className='inline-flex -mt-16 md:-mt-28 mb-4 w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-[5px] basis-44 relative z-[1] border-2 border-mediumGrey bg-white'>
          <div className='block overflow-hidden absolute box-border m-0 inset-0'>
            <Image
              src={'/images/moonbirds-profile.avif'}
              alt='Project Profile'
              fill
              className='object-cover aspect-auto overflow-hidden rounded-[5px]'
            />
          </div>
        </div>
      </div>
    </>
  )
}
