import { LayoutContainer } from '@components/layout/core/Layout'
import type { Repository } from '@prisma/client'
import React from 'react'
import { BannerDisplay } from '../../layout/BannerDisplay'
import { LogoDisplay } from '../../layout/LogoDisplay'

interface MintLayoutHeaderProps {
  repository: Repository | undefined | null
}

export const CollectionLayoutHeader: React.FC<MintLayoutHeaderProps> = ({ repository }) => {
  return (
    <div>
      <div className='relative overflow-hidden'>
        <BannerDisplay repositoryId={repository?.id} />
      </div>
      <LayoutContainer border='none'>
        <LogoDisplay repositoryId={repository?.id} />
      </LayoutContainer>
    </div>
  )
}
