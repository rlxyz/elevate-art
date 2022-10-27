import { Card } from '@elevateart/ui'
import Image from 'next/image'
import { getZoraClient } from '../../server/zdk'
import { isAddress } from '../../utils/ethers'
import IngestButton from './ingest-button'

export default async function Page({ params: { address } }: { params: { address: string } }) {
  if (!isAddress(address)) {
    // @todo better error handling
    return <div>{address} not a valid address</div>
  }

  const response = await getZoraClient().tokens({
    where: {
      tokens: Array.from(Array(100).keys()).map((i) => ({
        address,
        tokenId: String(i),
      })),
    },
    includeFullDetails: false,
  })

  return (
    <div className='p-12'>
      <div className='grid grid-cols-6 gap-6'>
        {response.tokens.nodes.map((token) => (
          <Card>
            <div className='pb-2'>
              <Image
                width={500}
                height={500}
                alt={token?.token.name || ''}
                src={token?.token.image?.url || ''}
                className='rounded-primary'
              />
            </div>
            <div className='flex flex-col'>
              <span className='text-foreground'>{token.token.name}</span>
              {/* <span className='text-foreground'>{token.token.name}</span> */}
            </div>
          </Card>
        ))}
        <IngestButton address={address} />
      </div>
    </div>
  )
}
