import type { ContractDeployment } from '@prisma/client'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils.js'
import type { Session } from 'next-auth'
import type { RhapsodyContractData } from '../../../../shared/contracts/ContractData'
import { SaleLayout } from './SaleLayout'
import { SaleMintCountInput } from './SaleMintCountInput'
import { SalePrice } from './SalePrice'
import { SalePhaseEnum, useFetchSaleRequirements } from './useFetchContractData'
import { usePublicPurchase } from './usePublicPurchase'

export const SaleLayoutPublicPurchase = ({
  session,
  contractData,
  contractDeployment,
}: {
  session: Session | null
  contractData: RhapsodyContractData
  contractDeployment: ContractDeployment
}) => {
  /** Fetch the user-mint data from Contract */
  const { data, isLoading, isError } = useFetchSaleRequirements({
    session,
    contractDeployment,
    type: SalePhaseEnum.enum.Public,
  })

  /** Variables */
  const { userBalance, userMintCount, totalMinted, userMintLeft, maxAllocation, allowToMint, hasMintAllocation } = data

  /** Fetch the public-mint functionality */
  const { write, setMintCount, mintCount } = usePublicPurchase({
    address: session?.user?.address,
    contractData,
    contractDeployment,
    enabled: !!session?.user?.id && !isLoading && !isError,
  })

  return (
    <SaleLayout>
      <SaleLayout.Header title='Public Sale' />
      <SaleLayout.Body>
        <div className='flex justify-between items-center'>
          <SalePrice mintPrice={contractData.publicPeriod.mintPrice} quantity={mintCount} chainId={contractDeployment.chainId} />
          <SaleMintCountInput
            maxValue={userMintLeft}
            onChange={(value) => setMintCount(value)}
            value={mintCount}
            disabled={!session?.user?.id || !hasMintAllocation}
          />
        </div>
      </SaleLayout.Body>
      <SaleLayout.Footer>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col'>
            <span className='text-[0.6rem]'>
              You minted <strong>{formatUnits(userMintCount || BigNumber.from(0), 0)} NFTs</strong> from this collection
            </span>
            <span className='text-[0.6rem]'>
              You have <strong>{formatUnits(userMintLeft, 0)} mints</strong> left
            </span>
          </div>
          <button
            disabled={!session?.user?.id || isLoading || !allowToMint}
            onClick={() => {
              try {
                write()
              } catch (error) {
                console.error(error)
              }
            }}
            type='button'
            className='bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:text-darkGrey disabled:cursor-not-allowed border border-mediumGrey px-3 py-1 rounded-[5px]'
          >
            Mint
          </button>
        </div>
      </SaleLayout.Footer>
    </SaleLayout>
  )
}
