import { MintButton } from '@Components/Minter/MintButton'
import { NFTAmount } from '@Components/Minter/NFTAmount'
import { PresaleRequirements } from '@Components/MintRequirements'
import { usePresaleMint } from '@Hooks/usePresaleMint'
import { usePresaleRequirements } from '@Hooks/usePresaleRequirements'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

export const PresaleMintSection: React.FC = () => {
  const account = useAccount()
  const { maxAllocation, hasMintAllocation, allowToMint, presaleIsActive } =
    usePresaleRequirements(account?.address)
  const [mintCount, setMintCount] = useState(1)
  const { mint, isLoading } = usePresaleMint(account?.address)

  return (
    <>
      <div className="mt-10">
        <h2 className="text-lg font-bold">Presale Requirements</h2>
        <div className="flex flex-col border border-lightGray rounded-lg mt-4">
          <PresaleRequirements />
          <NFTAmount
            maxValue={maxAllocation}
            value={mintCount}
            onChange={value => setMintCount(value)}
            disabled={!hasMintAllocation || !presaleIsActive}
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
