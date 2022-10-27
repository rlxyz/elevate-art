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

  const args = {
    token: {
      address,
      tokenId: '314',
    },
    includeFullDetails: false, // Optional, provides more data on the NFT such as all historical events
  }
  const response = await getZoraClient().token(args)
  return (
    <div className='h-screen flex flex-col items-center space-y-3 justify-center'>
      <Card>
        <Image width={500} height={500} alt={response.token?.token.name || ''} src={response.token?.token.image?.url || ''} />
      </Card>
      <IngestButton address={address} />
    </div>
  )
}
