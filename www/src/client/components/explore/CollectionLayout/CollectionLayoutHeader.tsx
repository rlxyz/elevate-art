import { LayoutContainer } from '@components/layout/core/Layout'
import type { ContractDeployment, Repository } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

interface MintLayoutHeaderProps {
  contractDeployment: ContractDeployment | undefined | null
  repository: Repository | undefined | null
}

export const CollectionLayoutHeader: React.FC<MintLayoutHeaderProps> = ({ contractDeployment, repository }) => {
  return (
    <div>
      <div className='relative overflow-hidden'>
        <div className='h-72 w-screen'>
          <div className='flex items-center justify-center absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border border-b border-mediumGrey bg-white h-full w-full'>
            <div className='block overflow-hidden absolute box-border m-0 rounded-[5px] bg-lightGray animate-pulse-gradient-infinite inset-0'>
              {repository?.bannerImageUrl && (
                <Image
                  src={repository.bannerImageUrl}
                  alt='collection-banner'
                  width={2800}
                  height={800}
                  className='block object-cover m-auto overflow-hidden'
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <LayoutContainer border='none'>
        <div className='inline-flex -mt-16 md:-mt-28 mb-4 w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-[5px] basis-44 relative z-[1] border border-mediumGrey bg-white'>
          <div className='block overflow-hidden absolute box-border m-0 rounded-[5px] bg-mediumGrey/70 animate-pulse-gradient-infinite inset-0'>
            {repository?.logoImageUrl && (
              <Image
                src={repository.logoImageUrl}
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
