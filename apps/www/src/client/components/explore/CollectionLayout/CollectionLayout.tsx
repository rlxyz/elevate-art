import React from 'react'
import { CollectionLayoutBody } from './CollectionLayoutBody'
import { CollectionLayoutDescription } from './CollectionLayoutDescription'
import { CollectionLayoutHeader } from './CollectionLayoutHeader'

interface MintLayoutProps {
  children: React.ReactNode
}

export const CollectionLayout = ({ children }: MintLayoutProps) => {
  return <div className='w-screen pb-6'>{children}</div>
}

CollectionLayout.Header = CollectionLayoutHeader
CollectionLayout.Description = CollectionLayoutDescription
CollectionLayout.Body = CollectionLayoutBody
