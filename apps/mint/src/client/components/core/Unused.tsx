import Card from '@Components/ui/card'
import { PageRoutesNavbar } from '@Components/ui/header/PageRoutesNavbar'
import type { ContractDeployment } from '@prisma/client'
import { parseChainId } from '@Utils/ethers'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { usePresaleMint } from 'src/client/hooks/usePresaleMint'
import { usePresaleRequirements } from 'src/client/hooks/usePresaleRequirements'
import { useAccount } from 'wagmi'
import { MintButton } from './Minter/MintButton'
import { NFTAmount } from './Minter/NFTAmount'
import { ConnectWalletSection } from './MintSection/ConnectWalletSection'
import { PublicSaleCountdown as MintSaleCountdown } from './MintSection/PublicSaleCountdown'

export const buildEtherscanLink = ({ address, chainId }: { address: string; chainId: number }) => {
  return `https://${chainId === 1 ? '' : `${parseChainId(chainId)}.`}etherscan.io/address/${address}`
}

const MintSaleSelector: React.FC<{ contractDeployment: ContractDeployment; className?: string }> = ({ contractDeployment, className }) => {
  return (
    <div className={clsx(className)}>
      <div className='flex justify-center space-x-3'>
        <PageRoutesNavbar>
          <PageRoutesNavbar.Item
            opts={{ href: `/${contractDeployment.address}/presale`, name: 'Presale', enabled: true, loading: false }}
          />
          <PageRoutesNavbar.Item
            opts={{ href: `/${contractDeployment.address}/public`, name: 'Public Sale', enabled: false, loading: false }}
          />
        </PageRoutesNavbar>
      </div>
    </div>
  )
}

const MintSaleAllocation: React.FC = () => {
  const { isConnected, address } = useAccount()
  const { userAllocation, userMintCount } = usePresaleRequirements(address)

  return (
    <>
      {isConnected ? (
        <span>{`You have minted ${userMintCount} out of ${userAllocation} eligible NFTs in Presale`}</span>
      ) : (
        <span>
          <strong>Connect Wallet</strong> to mint from the RoboGhost collection
        </span>
      )}
    </>
  )
}

const MintSaleDisplay: React.FC<{ contractDeployment: ContractDeployment }> = ({ contractDeployment }) => {
  const { isConnected, isDisconnected, address } = useAccount()
  const [mintCount, setMintCount] = useState(1)
  const { maxAllocation, userAllocation, hasMintAllocation, allowToMint, userMintCount } = usePresaleRequirements(address)
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
    <Card className='flex flex-col w-1/2 justify-center'>
      <MintSaleCountdown />
      <MintSaleAllocation />
      <ConnectWalletSection />
      <NFTAmount
        maxValue={maxAllocation}
        onChange={(value) => setMintCount(value)}
        value={mintCount}
        disabled={isDisconnected || !hasMintAllocation}
      />
      <MintButton disabled={isDisconnected || isLoading || !allowToMint} onClick={() => mint(mintCount)} />
    </Card>
  )
}

const MintSaleFooter: React.FC<{ contractDeployment: ContractDeployment }> = ({ contractDeployment }) => {
  return (
    <div className=''>
      <div className='flex space-x-1'>
        <h3 className='text-xs'>Number minted</h3>
        <span className='text-xs font-semibold'>8,443/10,000</span>
      </div>
      <div className='flex space-x-1'>
        <h3 className='text-xs'>Presale start</h3>
        <span className='text-xs font-semibold'>{new Date().toLocaleString()}</span>
      </div>
      <div className='flex space-x-1'>
        <h3 className='text-xs'>Presale end</h3>
        <span className='text-xs font-semibold'>{new Date().toLocaleString()}</span>
      </div>
      <div className='flex space-x-1'>
        <h3 className='text-xs'>Public sale</h3>
        <span className='text-xs font-semibold'>{new Date().toLocaleString()}</span>
      </div>
      <div className='flex space-x-1'>
        <h3 className='text-xs'>Contract Address</h3>
        <span className='text-xs font-semibold'>{contractDeployment.address}</span>
      </div>
    </div>
  )
}

const LineWithGradient: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('h-[1px] flex-1 bg-gradient-to-r from-mediumGrey via-blueHighlight to-mediumGrey z-1', className)} />
)
