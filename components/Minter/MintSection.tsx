import { ConnectButton } from '@Components/ConnectButton'
import { MintButton } from '@Components/Minter/MintButton'
import { NFTAmount } from '@Components/Minter/NFTAmount'

export const MintSection = () => {
  return (
    <div className="ml-5">
      <div className="font-bold text-xl font-plus-jakarta-sans mb-5">
        Public Sale (4459/5555 Minted)
      </div>
      <hr className="border-lightGray" />
      <div className="py-10">
        You have minted 0 out of 10 eligible NFTs in Public Sale
      </div>
      <div className="flex flex-col border border-lightGray rounded-lg p-5">
        <div className="flex pt-3 pb-8 justify-between items-center">
          <span>
            Wallet{' '}
            <span className="h-[12px] w-[12px] bg-greenDot rounded-full inline-block ml-2"></span>
          </span>
          <ConnectButton normalButton />
        </div>
        <hr className="border-lightGray" />
        <div className="mt-2">
          <NFTAmount
            maxValue={10}
            onChange={value => {
              console.log({ value }) // eslint-disable-line
            }}
            value={0}
          />
          <div className="flex justify-between items-center mt-7">
            <span className="block font-plus-jakarta-sans font-bold">Total</span>
            <span className="block font-plus-jakarta-sans font-bold">0 ETH</span>
          </div>
        </div>
        <div className="mt-10">
          <MintButton
            mintCount={0}
            onClick={() => {
              console.log('Minted') // eslint-disable-line
            }}
          />
        </div>
      </div>
    </div>
  )
}
