import { RightContentContainer } from '@Components/Layout/RightContentContainer'
import { MintButton } from '@Components/Minter/MintButton'
import { NFTAmount } from '@Components/Minter/NFTAmount'
import { useTotalMinted } from '@Hooks/contractsRead'
import { useGetProjectDetail } from '@Hooks/useGetProjectDetail'
import { config } from '@Utils/config'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import { ConnectWalletSection } from './ConnectWalletSection'

export const PresaleView = () => {
  const totalMinted = useTotalMinted()
  const { data } = useGetProjectDetail('rlxyz')
  const { isConnected, isDisconnected } = useAccount()
  const [mintCount, setMintCount] = useState(1)

  return (
    <RightContentContainer
      firstHeading={
        <span>{`Public Sale (${totalMinted}/${data?.totalSupply} Minted)`}</span>
      }
      secondHeading={
        isConnected ? (
          <span>You have minted 0 out of 10 eligible NFTs in Presale</span>
        ) : (
          <span>
            <strong>Connect Wallet</strong> to mint from the RoboGhost collection
          </span>
        )
      }
    >
      <ConnectWalletSection />
      <hr className="border-lightGray" />
      <div className="mt-2">
        <NFTAmount
          maxValue={data?.maxAllocationPerAddress}
          onChange={value => setMintCount(value)}
          value={mintCount}
          disabled={isDisconnected}
        />
        <div className="flex justify-between items-center mt-7">
          <span className="block font-plus-jakarta-sans font-bold">Total</span>
          <span className="block font-plus-jakarta-sans font-bold">{`${
            config.totalPriceAllocation[mintCount - 1]
          } ETH`}</span>
        </div>
      </div>
      <div className="mt-10">
        <MintButton
          onClick={() => {
            console.log('Minted') // eslint-disable-line
          }}
        />
      </div>
    </RightContentContainer>
  )
}
