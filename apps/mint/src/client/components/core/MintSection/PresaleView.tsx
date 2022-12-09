import { useEffect, useState } from 'react'
import { usePresaleMint } from 'src/client/hooks/usePresaleMint'
import { usePresaleRequirements } from 'src/client/hooks/usePresaleRequirements'
import { config } from 'src/client/utils/config'
import { useAccount } from 'wagmi'

import { RightContentContainer } from '../Layout/RightContentContainer'
import { MintButton } from '../Minter/MintButton'
import { NFTAmount } from '../Minter/NFTAmount'
import { ConnectWalletSection } from './ConnectWalletSection'
import { PublicSaleCountdown } from './PublicSaleCountdown'

export const PresaleView = () => {
  const { isConnected, isDisconnected, address } = useAccount()
  const [mintCount, setMintCount] = useState(1)
  const { maxAllocation, userAllocation, hasMintAllocation, allowToMint, userMintCount } =
    usePresaleRequirements(address)
  const { mint, isLoading, isError } = usePresaleMint(address)

  useEffect(() => {
    if (isDisconnected) {
      setMintCount(1)
    }
  }, [isDisconnected])

  useEffect(() => {
    if (!isLoading && isError) {
      setMintCount(1)
    }
  }, [isError, isLoading])

  return (
    <RightContentContainer
      firstHeading={<PublicSaleCountdown />}
      secondHeading={
        isConnected ? (
          <span>{`You have minted ${userMintCount} out of ${userAllocation} eligible NFTs in Presale`}</span>
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
          maxValue={maxAllocation}
          onChange={value => setMintCount(value)}
          value={mintCount}
          disabled={isDisconnected || !hasMintAllocation}
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
          disabled={isDisconnected || isLoading || !allowToMint}
          onClick={() => mint(mintCount)}
        />
      </div>
    </RightContentContainer>
  )
}
