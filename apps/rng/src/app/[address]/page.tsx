import { Card } from '@elevateart/ui'
import { ZDK, ZDKChain, ZDKNetwork } from '@zoralabs/zdk'
import Image from 'next/image'

const networkInfo = {
  network: ZDKNetwork.Ethereum,
  chain: ZDKChain.Mainnet,
}

const API_ENDPOINT = 'https://api.zora.co/graphql'
const args = {
  endPoint: API_ENDPOINT,
  networks: [networkInfo],
  apiKey: process.env.API_KEY,
}

const zdk = new ZDK(args) // All arguments are optional

export default async function Page({ params }: { params: string }) {
  const args = {
    token: {
      address: '0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63',
      tokenId: '314',
    },
    includeFullDetails: false, // Optional, provides more data on the NFT such as all historical events
  }
  const response = await zdk.token(args)
  return (
    <div className='h-screen flex items-center justify-center'>
      <Card>
        <Image width={500} height={500} alt={response.token?.token.name || ''} src={response.token?.token.image?.url || ''} />
      </Card>
    </div>
  )
}
