import type { ContractDeployment } from '@prisma/client'
import type { RhapsodyContractData } from '@utils/contracts/ContractData'
import { formatUnits } from 'ethers/lib/utils.js'
import type { Session } from 'next-auth'
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
  const { userMintCount, userMintLeft, allowToMint } = data

  /** Fetch the public-mint functionality */
  const {
    write,
    setMintCount,
    mintCount,
    isLoading: isLoadingPurchase,
    isProcessing: isProcessingPurchase,
  } = useClaimPurchase({
    address: session?.user?.address,
    contractDeployment,
    enabled: !!session?.user?.id && !isLoading && !isError,
  })

  return (
    <SaleLayout>
      <SaleLayout.Header
        title='Claim'
        endingDate={
          now < contractData.claimPeriod.startTimestamp
            ? { label: 'Claim Starts In', value: contractData.claimPeriod.startTimestamp }
            : { label: 'Claim Ends In', value: contractData.publicPeriod.startTimestamp }
        }
      />
      <SaleLayout.Body>
        <div className='flex justify-between items-center'>
          <SalePrice mintPrice={contractData.claimPeriod.mintPrice} quantity={mintCount} chainId={contractDeployment.chainId} />
          <SaleMintCountInput
            maxValue={userMintLeft}
            onChange={(value) => setMintCount(value)}
            value={mintCount}
            disabled={!session?.user?.id || !allowToMint}
          />
        </div>
      </SaleLayout.Body>
      <SaleLayout.Footer>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col w-fit '>
            {userMintCount && Number(formatUnits(userMintCount, 0)) ? (
              <span className='text-[0.6rem] '>
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
            disabled={!session?.user?.id || isLoading || isLoadingPurchase || isProcessingPurchase || !allowToMint}
            onClick={() => {
              try {
                write()
              } catch (e) {
                console.error(e)
              }
            }}
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
