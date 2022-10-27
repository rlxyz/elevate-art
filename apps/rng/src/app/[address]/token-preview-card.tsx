'use client'
import { Card } from '@elevateart/ui'
import { Token } from '@zoralabs/zdk/dist/queries/queries-sdk'
import Image from 'next/image'
import RenderIfVisible from 'react-render-if-visible'

export default function TokenPreviewCard({ token }: { token: Token }) {
  return (
    <RenderIfVisible>
      <Card>
        <div className='pb-2'>
          <Image width={250} height={250} alt={token.name || ''} src={token.image?.url || ''} className='rounded-primary' />
        </div>
        <div className='flex flex-col'>
          <span className='text-foreground'>{token.name}</span>
          {/* <span className='text-foreground'>{token.token.name}</span> */}
        </div>
      </Card>
    </RenderIfVisible>
  )
}
