import { getZoraClient } from '../../server/zdk'
import { isAddress } from '../../utils/ethers'
import TokenPreviewCard from './token-preview-card'

export default async function Page({ params: { address } }: { params: { address: string } }) {
  if (!isAddress(address)) {
    // @todo better error handling
    return <div>{address} not a valid address</div>
  }

  const response = await getZoraClient().tokens({
    where: {
      tokens: Array.from(Array(20).keys()).map((i) => ({
        address,
        tokenId: String(i),
      })),
    },
    includeFullDetails: false,
    includeSalesHistory: false,
  })

  return (
    <div className='grid grid-cols-4 gap-6 overflow-hidden'>
      {response.tokens.nodes
        .sort((a, b) => Number(a.token?.tokenId) - Number(b.token?.tokenId))
        .map((token) => (
          <>
            <TokenPreviewCard token={token?.token} />
            {/* <div></div> */}
          </>
        ))}
      {/* <IngestButton address={address} /> */}
    </div>
  )
}
