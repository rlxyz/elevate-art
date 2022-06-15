import { MintButton } from '@components/Minter/MintButton'
import { NFTAmount, PublicSaleRequirements } from '@components/MintRequirements'
import { usePublicSaleRequirements } from '@hooks/usePublicSaleRequirements'
import React, { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'

export const PublicSaleMintSection: React.FC = () => {
  const { data: account } = useAccount()
  const { maxAllocation, hasMintAllocation, allowToMint } = usePublicSaleRequirements(
    account?.address,
  )
  const [mintCount, setMintCount] = useState(1)

  const handleNFTAmountOnChange = useCallback(
    (value: number) => {
      setMintCount(value)
    },
    [setMintCount],
  )

  return (
    <>
      <div className="mt-10">
        <h2 className="text-lg font-bold">Public Sale Requirements</h2>
        <div className="flex flex-col border border-gray rounded-lg mt-4">
          <PublicSaleRequirements />
          <NFTAmount
            maxValue={maxAllocation}
            value={mintCount}
            onChange={handleNFTAmountOnChange}
            disabled={!hasMintAllocation}
          />
        </div>
      </div>
      <div className="mt-6">
        <MintButton mintCount={mintCount} disabled={!allowToMint} />
      </div>
    </>
  )
}
