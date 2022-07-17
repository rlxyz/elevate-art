import { MintButton } from '@Components/Minter/MintButton'
import { NFTAmount } from '@Components/Minter/NFTAmount'
import { PublicSaleRequirements } from '@Components/MintRequirements'
import { usePublicMint } from '@Hooks/usePublicMint'
import { usePublicSaleRequirements } from '@Hooks/usePublicSaleRequirements'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

export const PublicSaleMintSection: React.FC = () => {
  const account = useAccount()
  const { maxAllocation, hasMintAllocation, allowToMint } = usePublicSaleRequirements(
    account?.address,
  )
  const [mintCount, setMintCount] = useState(1)
  const { mint, isLoading } = usePublicMint(account?.address)

  return (
    <>
      <div className="mt-10">
        <h2 className="text-lg font-bold">Public Sale Requirements</h2>
        <div className="flex flex-col border border-lightGray rounded-lg mt-4">
          <PublicSaleRequirements />
          <NFTAmount
            maxValue={maxAllocation}
            value={mintCount}
            onChange={value => setMintCount(value)}
            disabled={!hasMintAllocation}
          />
        </div>
      </div>
      <div className="mt-6">
        <MintButton
          mintCount={mintCount}
          disabled={!allowToMint || isLoading}
          onClick={() => mint(mintCount)}
        />
      </div>
    </>
  )
}
