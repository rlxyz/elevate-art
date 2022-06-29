import { MintButton } from '@components/Minter/MintButton'
import { NFTAmount, PresaleRequirements } from '@components/MintRequirements'
import { usePresaleMint } from '@hooks/usePresaleMint'
import { usePresaleRequirements } from '@hooks/usePresaleRequirements'
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
        <div className="flex flex-col border border-gray rounded-lg mt-4">
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
