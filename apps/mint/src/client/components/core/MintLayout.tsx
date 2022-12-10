import Card from '@Components/layout/card'
import { PageRoutesNavbar } from '@Components/layout/header/PageRoutesNavbar'
import type { Organisation, Repository, RepositoryContractDeployment, RepositoryDeployment } from '@prisma/client'
import clsx from 'clsx'
import { BigNumber, ethers } from 'ethers'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useMintPeriod } from 'src/client/hooks/contractsRead'
import { usePresaleMint } from 'src/client/hooks/usePresaleMint'
import { usePresaleRequirements } from 'src/client/hooks/usePresaleRequirements'
import type { ContractData } from 'src/pages/[address]'
import { useAccount } from 'wagmi'
import { AllowlistCheckerView } from './AllowlistCheckerView'
import { MintButton } from './Minter/MintButton'
import { NFTAmount } from './Minter/NFTAmount'
import { SocialMediaLink } from './Minter/SocialMediaLink'
import { ConnectWalletSection } from './MintSection/ConnectWalletSection'
import { PublicSaleCountdown as MintSaleCountdown } from './MintSection/PublicSaleCountdown'

interface MintLayoutProps {
  children: React.ReactNode
}

export const MintLayout = ({ children }: MintLayoutProps) => {
  return <div className='w-screen'>{children}</div>
}

interface MintLayoutHeaderProps {
  bannerImageUrl: string
  profileImageUrl: string
}

export const MintLayoutHeader: React.FC<MintLayoutHeaderProps> = ({ bannerImageUrl, profileImageUrl }) => {
  return (
    <div>
      <div className='relative overflow-hidden'>
        <div className='h-[200px] md:h-0 pb-[20%]'>
          <div className='block absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border border-b border-mediumGrey'>
            <Image src={bannerImageUrl} alt='collection-banner' fill className='object-cover aspect-auto overflow-hidden' />
          </div>
        </div>
      </div>
      <div className='py-0 px-5 lg:px-16 2xl:px-32 w-full'>
        <div className='inline-flex -mt-16 md:-mt-28 mb-4 w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-[5px] basis-44 relative z-[1] border-2 border-mediumGrey bg-white'>
          <div className='block overflow-hidden absolute box-border m-0 inset-0'>
            <Image src={profileImageUrl} alt='collection-profile' fill className='object-cover aspect-auto overflow-hidden rounded-[5px]' />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ContractDeploymentDetailsProps {
  repository: Repository
  organisation: Organisation
  deployment: RepositoryDeployment
  contractDeployment: RepositoryContractDeployment
  contractData: ContractData
}

const ContractDeploymentDetails: React.FC<ContractDeploymentDetailsProps> = ({
  repository,
  organisation,
  deployment,
  contractDeployment,
  contractData,
}) => (
  <div className='flex flex-col space-y-3'>
    <div className='flex'>
      <h1 className='text-2xl font-bold'>{repository.name}</h1>
    </div>

    <div className='flex space-x-1'>
      <h2 className='text-xs'>By</h2>
      <h1 className='text-xs font-bold'>{organisation.name}</h1>
    </div>

    <div className='flex flex-row items-center space-x-2'>
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Total</h2>
        <h1 className='text-xs font-bold'>{deployment.collectionTotalSupply}</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Minted</h2>
        <h1 className='text-xs font-bold'>{ethers.utils.formatUnits(contractData.totalSupply, 0)}</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Price</h2>
        <h1 className='text-xs font-bold'>{ethers.utils.formatEther(BigNumber.from(contractData.ethPrice))} ether</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Chain</h2>
        <h1 className='text-xs font-bold'>{contractDeployment.chainId === 1 ? 'Ethereum' : 'ChainNotImplemented'}</h1>
      </div>
    </div>
  </div>
)

interface MintLayoutDescriptionProps {
  repository: Repository
  organisation: Organisation
  deployment: RepositoryDeployment
  contractDeployment: RepositoryContractDeployment
  contractData: ContractData
}

export const MintLayoutDescription: React.FC<MintLayoutDescriptionProps> = ({
  repository,
  organisation,
  deployment,
  contractDeployment,
  contractData,
}) => {
  return (
    <div className='px-5 lg:px-16 2xl:px-32 w-full flex justify-between'>
      <ContractDeploymentDetails
        repository={repository}
        organisation={organisation}
        deployment={deployment}
        contractDeployment={contractDeployment}
        contractData={contractData}
      />
      <SocialMediaLink
        discordUrl={contractDeployment.discordUrl}
        twitterUrl={contractDeployment.twitterUrl}
        etherscanUrl={`https://etherscan.io/address/${contractDeployment.address}`}
      />
    </div>
  )
}

const MintSaleSelector: React.FC<{ contractDeployment: RepositoryContractDeployment; className?: string }> = ({
  contractDeployment,
  className,
}) => {
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

const MintSaleDisplay: React.FC<{ contractDeployment: RepositoryContractDeployment }> = ({ contractDeployment }) => {
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

const MintSaleFooter: React.FC<{ contractDeployment: RepositoryContractDeployment }> = ({ contractDeployment }) => {
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

const MintLayoutBody: React.FC<{ contractDeployment: RepositoryContractDeployment }> = ({ contractDeployment }) => {
  const { mintPhase } = useMintPeriod()

  return (
    <div className='space-y-6 my-12 w-full'>
      {/* <div className='w-full flex justify-center'>
      <LineWithGradient className='absolute w-full z-1' />
      <MintSaleSelector className='relative top-0 -translate-y-1/2' contractDeployment={contractDeployment} />
    </div> */}
      <div className='px-5 lg:px-16 2xl:px-32 w-full flex justify-between'>
        <div className='w-full justify-center grid grid-flow-col grid-cols-2 gap-x-6'>
          <AllowlistCheckerView />
          {/* <MintSaleDisplay contractDeployment={contractDeployment} /> */}
        </div>
      </div>

      {/* <MintSaleFooter contractDeployment={contractDeployment} /> */}
    </div>
  )
}

MintLayout.Header = MintLayoutHeader
MintLayout.Description = MintLayoutDescription
MintLayout.Body = MintLayoutBody
