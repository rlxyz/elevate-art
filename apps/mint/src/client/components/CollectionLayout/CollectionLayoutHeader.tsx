import { LayoutContainer } from '@Components/layout/core/Layout'
import type { RepositoryContractDeployment } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

interface MintLayoutHeaderProps {
  contractDeployment: RepositoryContractDeployment
}

export const CollectionLayoutHeader: React.FC<MintLayoutHeaderProps> = ({ contractDeployment }) => {
  return (
    <div>
      <div className='relative overflow-hidden'>
        <div className='h-72 w-screen'>
          <div className='flex items-center justify-center absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border border-b border-mediumGrey bg-lightGray'>
            {contractDeployment?.bannerUrl && (
              <Image
                src={contractDeployment.bannerUrl}
                alt='collection-banner'
                width={2800}
                height={800}
                className='block object-cover m-auto overflow-hidden'
              />
            )}
          </div>
        </div>
      </div>
      <LayoutContainer border='none'>
        <div className='inline-flex -mt-16 md:-mt-28 mb-4 w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-[5px] basis-44 relative z-[1] border border-mediumGrey bg-white'>
          <div className='block overflow-hidden absolute box-border m-0 inset-0'>
            {contractDeployment?.logoUrl && (
              <Image
                src={contractDeployment.logoUrl}
                alt='collection-profile'
                fill
                className='object-cover aspect-auto overflow-hidden rounded-[5px]'
              />
            )}
          </div>
        </div>
      </LayoutContainer>
    </div>
  )
}
