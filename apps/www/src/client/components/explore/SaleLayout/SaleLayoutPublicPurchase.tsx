import type { ContractDeployment } from '@prisma/client'
import type { RhapsodyContractData } from '@utils/contracts/ContractData'
import { formatUnits } from 'ethers/lib/utils.js'
import type { Session } from 'next-auth'
import { useMintLayoutCurrentTime } from '../MintLayout/useMintLayoutCurrentTime'
import { SaleLayout } from './SaleLayout'
import { SaleMintCountInput } from './SaleMintCountInput'
import { SalePrice } from './SalePrice'
import { useFetchPublicRequirements } from './useFetchPublicRequirements'
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
  const { data, isLoading, isError } = useFetchPublicRequirements({
    session,
    contractDeployment,
  })

  const { now } = useMintLayoutCurrentTime()

  /** Variables */
  const { userMintLeft, allowToMint } = data

  /** Fetch the public-mint functionality */
  const {
    write,
    setMintCount,
    mintCount,
    isLoading: isLoadingPurchase,
    isProcessing: isProcessingPurchase,
  } = usePublicPurchase({
    address: session?.user?.address,
    contractData,
    contractDeployment,
    enabled: !!session?.user?.id && !isLoading && !isError,
  })

  return (
    <SaleLayout>
      <SaleLayout.Header
        title='Public Sale'
        startingDate={
          now < contractData.publicPeriod.startTimestamp
            ? { label: 'Starts In', value: contractData.publicPeriod.startTimestamp }
            : undefined
        }
      />
      <SaleLayout.Body>
        <div className='flex justify-between items-center'>
          <SalePrice mintPrice={contractData.publicPeriod.mintPrice} quantity={mintCount} chainId={contractDeployment.chainId} />
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
