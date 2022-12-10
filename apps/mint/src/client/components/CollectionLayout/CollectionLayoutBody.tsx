import { LayoutContainer } from '@Components/layout/core/Layout'
import type { ReactNode } from 'react'
import React from 'react'

export const CollectionLayoutBody: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='space-y-6 my-12 w-full'>
      <LayoutContainer border='none'>{children}</LayoutContainer>
    </div>
  )
}
