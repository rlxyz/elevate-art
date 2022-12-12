import { useEffect, useState } from 'react'
import { useTotalMinted } from 'src/client/hooks/contractsRead'
import { usePublicSaleRequirements } from 'src/client/hooks/useFetchContractData'
import { useGetProjectDetail } from 'src/client/hooks/useGetProjectDetail'
import { usePublicMint } from 'src/client/hooks/usePublicMint'
import { config } from 'src/client/utils/config'
import { useAccount } from 'wagmi'

import { RightContentContainer } from '../Layout/RightContentContainer'
import { MintButton } from '../Minter/MintButton'
import { NFTAmount } from '../Minter/NFTAmount'
import { ConnectWalletSection } from './ConnectWalletSection'

export const PublicView = () => {
  const totalMinted = useTotalMinted()
  const { data } = useGetProjectDetail('rlxyz')
  const { isConnected, isDisconnected, address } = useAccount()
  const [mintCount, setMintCount] = useState(1)
  const { mint, isLoading, isError } = usePublicMint(address)
  const { maxAllocation, userAllocation, hasMintAllocation, allowToMint, userMintCount } = usePublicSaleRequirements(address)

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
      firstHeading={<span>{`Public Sale (${totalMinted}/${data?.totalSupply} Minted)`}</span>}
      secondHeading={
        isConnected ? (
          <span>{`You have minted ${userMintCount} out of ${userAllocation} eligible NFTs in Public Sale`}</span>
        ) : (
          <span>
            <strong>Connect Wallet</strong> to mint from the RoboGhost collection
          </span>
        )
      }
    >
      <ConnectWalletSection />
      <hr className='border-lightGray' />
      <div className='mt-2'>
        <NFTAmount
          maxValue={maxAllocation}
          onChange={(value) => setMintCount(value)}
          value={mintCount}
          disabled={isDisconnected || !hasMintAllocation}
        />
        <div className='flex justify-between items-center mt-7'>
          <span className='block font-plus-jakarta-sans font-bold'>Total</span>
          <span className='block font-plus-jakarta-sans font-bold'>{`${config.totalPriceAllocation[mintCount - 1]} ETH`}</span>
        </div>
      </div>
      <div className='mt-10'>
        <MintButton disabled={isDisconnected || isLoading || !allowToMint} onClick={() => mint(mintCount)} />
      </div>
    </RightContentContainer>
  )
}
