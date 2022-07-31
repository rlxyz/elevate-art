import { RightContentContainer } from '@Components/Layout/RightContentContainer'
import { MintButton } from '@Components/Minter/MintButton'
import { NFTAmount } from '@Components/Minter/NFTAmount'
import { useTotalMinted } from '@Hooks/contractsRead'
import { useGetProjectDetail } from '@Hooks/useGetProjectDetail'
import { usePublicMint } from '@Hooks/usePublicMint'
import { usePublicSaleRequirements } from '@Hooks/usePublicSaleRequirements'
import { config } from '@Utils/config'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { ConnectWalletSection } from './ConnectWalletSection'

export const PublicView = () => {
  const totalMinted = useTotalMinted()
  const { data } = useGetProjectDetail('rlxyz')
  const { isConnected, isDisconnected, address } = useAccount()
  const [mintCount, setMintCount] = useState(1)
  const { mint, isLoading, isError } = usePublicMint(address)
  const { maxAllocation, hasMintAllocation, allowToMint, userMintCount } =
    usePublicSaleRequirements(address)

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
      firstHeading={
        <span>{`Public Sale (${totalMinted}/${data?.totalSupply} Minted)`}</span>
      }
      secondHeading={
        isConnected ? (
          <span>{`You have minted ${userMintCount} out of ${data?.maxAllocationPerAddress} eligible NFTs in Public Sale`}</span>
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
