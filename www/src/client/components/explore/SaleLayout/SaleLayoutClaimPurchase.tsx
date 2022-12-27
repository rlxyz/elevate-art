import type { ContractDeployment } from '@prisma/client'
import { formatUnits } from 'ethers/lib/utils.js'
import type { Session } from 'next-auth'
import type { RhapsodyContractData } from '../../../../shared/contracts/ContractData'
import { useMintLayoutCurrentTime } from '../MintLayout/useMintLayoutCurrentTime'
import { SaleLayout } from './SaleLayout'
import { SaleMintCountInput } from './SaleMintCountInput'
import { SalePrice } from './SalePrice'
import { useClaimPurchase } from './useClaimPurchase'
import { useFetchClaimRequirements } from './useFetchClaimRequirements'

export const SaleLayoutClaimPurchase = ({
  session,
  contractData,
  contractDeployment,
}: {
  session: Session | null
  contractData: RhapsodyContractData
  contractDeployment: ContractDeployment
}) => {
  /** Fetch the user-mint data from Contract */
  const { data, isLoading, isError } = useFetchClaimRequirements({
    session,
    contractDeployment,
  })
  const { now } = useMintLayoutCurrentTime()
  /** Variables */
  const { userBalance, userMintCount, totalMinted, userMintLeft, maxAllocation, allowToMint, hasMintAllocation } = data

  /** Fetch the public-mint functionality */
  const { write, setMintCount, mintCount } = useClaimPurchase({
    address: session?.user?.address,
    contractData,
    contractDeployment,
    enabled: !!session?.user?.id && !isLoading && !isError,
  })

  /** Validation */
  //! @todo add walletCheck validation
  // const { validateAllowlist } = useWalletCheck()

  return (
    <SaleLayout>
      <SaleLayout.Header
        title='Claim'
        endingDate={
          now < contractData.claimPeriod.startTimestamp
            ? { label: 'Claim Starts In', value: contractData.claimPeriod.startTimestamp }
            : { label: 'Claim Ends In', value: contractData.presalePeriod.startTimestamp }
        }
      />
      <SaleLayout.Body>
        <div className='flex justify-between items-center'>
          <SalePrice mintPrice={contractData.claimPeriod.mintPrice} quantity={mintCount} chainId={contractDeployment.chainId} />
          <SaleMintCountInput
            maxValue={maxAllocation}
            onChange={(value) => setMintCount(value)}
            value={mintCount}
            disabled={!!session?.user?.id || !hasMintAllocation}
          />
        </div>
      </SaleLayout.Body>
      <SaleLayout.Footer>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col items-center w-fit'>
            {userMintCount && Number(formatUnits(userMintCount, 0)) ? (
              <span className='text-[0.6rem]'>
                You minted <strong>{formatUnits(userMintCount, 0)} NFTs</strong> from this collection
              </span>
            ) : (
              <></>
            )}
            {allowToMint && Number(formatUnits(userMintLeft, 0)) ? (
              <span className='text-[0.6rem]'>
                You can mint <strong>{formatUnits(userMintLeft, 0)} NFTs</strong> from this collection
              </span>
            ) : (
              <></>
            )}
          </div>
          <button
            disabled={!!session?.user?.id || isLoading || !allowToMint}
            onClick={() => write()}
            type='submit'
            className='bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:text-darkGrey disabled:cursor-not-allowed border border-mediumGrey px-3 py-1 rounded-[5px]'
          >
            Mint
          </button>
        </div>
      </SaleLayout.Footer>
    </SaleLayout>
  )
}
