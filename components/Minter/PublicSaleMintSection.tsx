import { MintButton } from '@components/Minter/MintButton'
import { NFTAmount, PublicSaleRequirements } from '@components/MintRequirements'
import { usePublicMint } from '@hooks/usePublicMint'
import { usePublicSaleRequirements } from '@hooks/usePublicSaleRequirements'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

export const PublicSaleMintSection: React.FC = () => {
  const { data: account } = useAccount()
  const { maxAllocation, hasMintAllocation, allowToMint } = usePublicSaleRequirements(
    account?.address,
  )
  const [mintCount, setMintCount] = useState(1)
  const { mint, isLoading } = usePublicMint(account?.address)

  return (
    <>
      <div className="mt-10">
        <h2 className="text-lg font-bold">Public Sale Requirements</h2>
        <div className="flex flex-col border border-gray rounded-lg mt-4">
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
