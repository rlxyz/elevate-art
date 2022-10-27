import { Card } from '@elevateart/ui'
import Image from 'next/image'
import { getZoraClient } from '../../../server/zdk'
import { isAddress } from '../../../utils/ethers'

export default async function Page({ params: { address, id } }: { params: { address: string; id: number } }) {
  if (!isAddress(address)) {
    // @todo better error handling
    return <div>{address} not a valid address</div>
  }

  const response = await getZoraClient().token({
    token: {
      address,
      tokenId: String(id),
    },
    includeFullDetails: false,
  })

  return (
    <div className='flex h-[calc(100vh-10.5rem)] p-6 grid grid-cols-2 grid-auto-rows gap-6'>
      <Card className='w-fit col-span-1'>
        <Image
          width={750}
          height={750}
          alt={response.token?.token.name || ''}
          src={response.token?.token.image?.url || ''}
          className='rounded-primary'
        />
      </Card>
      <div className='col-span-1 grid grid-rows-6 gap-6'>
        <Card className='text-foreground text-xs flex flex-col justify-center space-y-1'>
          <label className='text-xs text-accents_6'>Address</label>
          <span className='text-accents_3'>{address}</span>
        </Card>
      </div>
    </div>
  )
}
