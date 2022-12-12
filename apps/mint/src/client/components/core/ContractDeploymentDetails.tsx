import NextLinkComponent from '@Components/ui/link/NextLink'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import type { Organisation, Repository, RepositoryContractDeployment, RepositoryDeployment } from '@prisma/client'
import { parseChainId } from '@Utils/ethers'
import { capitalize } from '@Utils/format'
import clsx from 'clsx'
import { BigNumber, ethers } from 'ethers'
import React from 'react'
import type { ContractData } from 'src/pages/[address]'

interface ContractDeploymentDetailsProps {
  repository: Repository
  organisation: Organisation
  deployment: RepositoryDeployment
  contractDeployment: RepositoryContractDeployment
  contractData: ContractData
}
export const ContractDeploymentDetails: React.FC<ContractDeploymentDetailsProps> = ({
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
        <h1 className='text-xs font-bold'>{ethers.utils.formatEther(BigNumber.from(contractData.mintPrice))} ether</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Chain</h2>
        <h1 className='text-xs font-bold'>{capitalize(parseChainId(contractDeployment.chainId))}</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Visit </h2>
        <h1 className='text-xs font-bold'>
          <NextLinkComponent underline className='w-fit' href={`/${contractDeployment.address}/gallery`}>
            Gallery
          </NextLinkComponent>
        </h1>
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
