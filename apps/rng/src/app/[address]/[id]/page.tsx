import { Card } from '@elevateart/ui'
import Image from 'next/image'
import { env } from '../../../env/client.mjs'
import { isAddress } from '../../../utils/ethers'

export default async function Page({ params: { address, id } }: { params: { address: string; id: number } }) {
  if (!isAddress(address)) {
    // @todo better error handling
    return <div>{address} not a valid address</div>
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/${address}/${id}`)
  const { attributes, image, name } = await response.json()

  return (
    <div className='grid-auto-rows flex grid h-[calc(100vh-10.5rem)] grid-cols-2 gap-6 p-6'>
      <Card className='col-span-1 w-fit'>
        <Image width={750} height={750} alt={name} src={image} className='rounded-primary' />
      </Card>
      <div className='col-span-1 grid grid-rows-6 gap-6'>
        {attributes.map(({ trait_type, value }: { trait_type: string; value: string }) => (
          <Card className='text-foreground flex flex-col justify-center space-y-1 text-xs'>
            <label className='text-accents_6 text-xs'>{trait_type}</label>
            <span className='text-accents_3'>{value}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
