import AvatarComponent from '@Components/layout/avatar/Avatar'
import Card from '@Components/layout/card'
import { LayoutContainer } from '@Components/layout/core/Layout'
import { PageRoutesNavbar } from '@Components/layout/header/PageRoutesNavbar'
import LinkComponent from '@Components/layout/link/Link'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import type { Organisation, Repository, RepositoryContractDeployment, RepositoryDeployment } from '@prisma/client'
import { parseChainId } from '@Utils/ethers'
import { capitalize } from '@Utils/format'
import clsx from 'clsx'
import { BigNumber, ethers } from 'ethers'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
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
import { PresalePurchaseView } from './PresalePurchaseView'
import { PublicPurchaseView } from './PublicPurchaseView'

interface MintLayoutProps {
  children: React.ReactNode
}

export const MintLayout = ({ children }: MintLayoutProps) => {
  return <div className='w-screen'>{children}</div>
}

interface MintLayoutHeaderProps {
  contractDeployment: RepositoryContractDeployment
}

export const MintLayoutHeader: React.FC<MintLayoutHeaderProps> = ({ contractDeployment }) => {
  return (
    <div>
      <div className='relative overflow-hidden'>
        <div className='h-72 w-screen'>
          <div className='flex items-center justify-center absolute top-0 left-0 bottom-0 right-0 m-0 overflow-hidden box-border border-b border-mediumGrey bg-lightGray'>
            {contractDeployment?.bannerUrl && (
              <Image
                src={contractDeployment.bannerUrl}
                alt='collection-banner'
                width={2800}
                height={800}
                className='block object-cover m-auto overflow-hidden'
              />
            )}
          </div>
        </div>
      </div>
      <LayoutContainer border='none'>
        <div className='inline-flex -mt-16 md:-mt-28 mb-4 w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-[5px] basis-44 relative z-[1] border border-mediumGrey bg-white'>
          <div className='block overflow-hidden absolute box-border m-0 inset-0'>
            {contractDeployment?.logoUrl && (
              <Image
                src={contractDeployment.logoUrl}
                alt='collection-profile'
                fill
                className='object-cover aspect-auto overflow-hidden rounded-[5px]'
              />
            )}
          </div>
        </div>
      </LayoutContainer>
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
  <div className='flex flex-col space-y-3 w-full md:w-1/2'>
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
        <h1 className='text-xs font-bold'>{capitalize(parseChainId(contractDeployment.chainId))}</h1>
      </div>
    </div>
    {contractDeployment.description && (
      <div>
        <Disclosure>
          <Disclosure.Button className={clsx('border-mediumGrey w-full flex items-center space-x-1')}>
            <h2 className='text-xs font-normal'>See description</h2>
            <ChevronDownIcon className='w-3 h-3' />
          </Disclosure.Button>
          <Disclosure.Panel>
            <p className='my-1 text-[0.6rem] italic'>{contractDeployment.description}</p>
          </Disclosure.Panel>
        </Disclosure>
      </div>
    )}
  </div>
)

interface MintLayoutDescriptionProps {
  repository: Repository
  organisation: Organisation
  deployment: RepositoryDeployment
  contractDeployment: RepositoryContractDeployment
  contractData: ContractData
}

const buildEtherscanLink = ({ address, chainId }: { address: string; chainId: number }) => {
  return `https://${chainId === 1 ? '' : `${parseChainId(chainId)}.`}etherscan.io/address/${address}`
}

export const MintLayoutDescription: React.FC<MintLayoutDescriptionProps> = ({
  repository,
  organisation,
  deployment,
  contractDeployment,
  contractData,
}) => {
  return (
    <LayoutContainer border='none'>
      <div className='w-full flex justify-between items-start'>
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
          etherscanUrl={buildEtherscanLink({
            address: contractDeployment.address,
            chainId: contractDeployment.chainId,
          })}
        />
      </div>
    </LayoutContainer>
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

const CollectorAnalytics = ({ contractDeployment }: { contractDeployment: RepositoryContractDeployment }) => (
  <Card>
    <h2 className='text-xs font-bold'>Collectors</h2>
    <div className='grid grid-cols-2 gap-3'>
      {[
        { address: '0xf8cA77ED09429aDe0d5C01ADB1D284C45324F608', total: 23 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 8 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 5 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 3 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 1 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 1 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 1 },
        { address: '0x598475F7Ebe9957f9833C5Fd7B7D992FC35D0640', total: 1 },
      ]
        .filter((x) => ethers.utils.isAddress(x.address))
        .sort((a, b) => b.total - a.total)
        .splice(0, 6)
        .map(({ address, total }) => (
          <article key={address} className='flex flex-row items-center space-x-3 border border-mediumGrey rounded-[5px] p-2 shadow-lg'>
            <AvatarComponent />
            <div className='flex justify-between w-full'>
              <LinkComponent
                href={buildEtherscanLink({
                  address,
                  chainId: contractDeployment.chainId,
                })}
                underline
                rel='noreferrer nofollow'
                target='_blank'
              >
                <span className='text-[0.65rem]'>
                  {address.slice(0, 6)}....{address.slice(address.length - 4)}
                </span>
              </LinkComponent>
              <p className='text-xs font-semibold'>{total}</p>
            </div>
          </article>
        ))}
    </div>
  </Card>
)

const MetadataAnalytics = ({ contractDeployment }: { contractDeployment: RepositoryContractDeployment }) => (
  <Card>
    <h2 className='text-xs font-bold'>Contract Information</h2>
    <div className='flex flex-col space-y-3'>
      {[
        {
          key: 'Contract Address',
          value: buildEtherscanLink({
            address: contractDeployment.address,
            chainId: contractDeployment.chainId,
          }),
          type: 'Link',
        },
        { key: 'Blockchain', value: capitalize(parseChainId(contractDeployment.chainId)), type: 'Basic' },
        { key: 'Token Standard', value: 'ERC721', type: 'Basic' },
        // { key: 'Base Image URI', value: 'Explore', type: 'Link' },
      ].map(({ key, value, type }) => (
        <article key={key} className='flex justify-between w-full'>
          <h3 className='text-xs'>{key}</h3>
          {type === 'Link' ? (
            <LinkComponent icon className='w-fit' href={value} underline rel='noreferrer nofollow' target='_blank'>
              <span className='text-xs'>Explore</span>
            </LinkComponent>
          ) : (
            <span className='text-xs'>{value}</span>
          )}
        </article>
      ))}
    </div>
  </Card>
)

const MintLayoutBody: React.FC<{ contractDeployment: RepositoryContractDeployment; contractData: ContractData }> = ({
  contractDeployment,
  contractData,
}) => {
  return (
    <div className='space-y-6 my-12 w-full'>
      <LayoutContainer border='none'>
        <div className='w-full justify-center flex flex-col gap-6 md:grid md:grid-flow-col md:grid-cols-2'>
          <div className='space-y-6'>
            <AllowlistCheckerView />
            <PresalePurchaseView />
            <PublicPurchaseView />
          </div>
          <div className='flex flex-col space-y-6'>
            <MetadataAnalytics contractDeployment={contractDeployment} />
            <CollectorAnalytics contractDeployment={contractDeployment} />
          </div>
        </div>
      </LayoutContainer>
    </div>
  )
}

MintLayout.Header = MintLayoutHeader
MintLayout.Description = MintLayoutDescription
MintLayout.Body = MintLayoutBody
