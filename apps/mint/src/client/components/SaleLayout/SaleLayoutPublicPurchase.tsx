import { MinusIcon } from '@heroicons/react/outline'
import type { RepositoryContractDeployment } from '@prisma/client'
import { BigNumber, ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils.js'
import type { Session } from 'next-auth'
import { Controller, useForm } from 'react-hook-form'
import { SalePhaseEnum, useFetchSaleRequirements } from 'src/client/hooks/useFetchContractData'
import { usePublicMint } from 'src/client/hooks/usePublicMint'
import type { ContractData } from 'src/pages/[address]'

import { SaleLayout } from './SaleLayout'
import { SalePrice } from './SalePrice'
import { useSaleMintCountInput } from './useSaleMintCountInput'

export const SaleLayoutPublicPurchase = ({
  session,
  contractData,
  contractDeployment,
}: {
  session: Session
  contractData: ContractData
  contractDeployment: RepositoryContractDeployment
}) => {
  /** Fetch the user-mint data from Contract */
  const { data, isLoading, isError } = useFetchSaleRequirements({
    session,
    contractDeployment,
    type: SalePhaseEnum.enum.Public,
  })

  /** The current mint selector (increment/decrement) */
  const { mintCount, setMintCount } = useSaleMintCountInput({ isLoading, isError })

  /** Variables */
  const { userBalance, userMintCount, totalMinted, userMintLeft, maxAllocation, allowToMint, hasMintAllocation } = data

  /** Fetch the public-mint functionality */
  const { write } = usePublicMint({ address: session.user?.address, invocations: mintCount, contractData, contractDeployment })

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      mintCount: BigNumber.from(1),
    },
  })

  console.log(errors)

  return (
    <SaleLayout
      onSubmit={handleSubmit((data) => {
        console.log('some-data', data)
        // write()
      })}
    >
      <SaleLayout.Header title='Public Sale' />
      <SaleLayout.Body>
        <div className='flex justify-between items-center'>
          <SalePrice mintPrice={contractData.mintPrice} quantity={mintCount} />
          <div className='rounded-md border border-mediumGrey flex justify-between items-center'>
            <Controller
              name='mintCount'
              control={control}
              rules={
                {
                  // required: true,
                  // validate: (value) => {
                  //   if (userBalance?.value.lt(value)) {
                  //     return 'Insufficient balance'
                  //   }
                  //   return value.gt(0)
                  // },
                }
              }
              render={({ field }) => (
                <button
                  // disabled={!session?.user?.id || !hasMintAllocation || BigNumber.from(getValues(`mintCount`)).eq(1)}
                  className='border-r border-mediumGrey px-2 py-2 disabled:cursor-not-allowed'
                  onClick={(e) => {
                    // e.preventDefault()
                    if (getValues(`mintCount`).gt(1)) {
                      setValue('mintCount', BigNumber.from(mintCount).sub(1))
                    }
                  }}
                  {...field}
                  value={formatUnits(mintCount, 0)}
                  type='button'
                >
                  <MinusIcon className='w-2 h-2 text-darkGrey' />
                </button>
              )}
            />
            <div className='w-full flex items-center justify-between py-1 text-xs px-2 cursor-default'>
              <span>{ethers.utils.formatUnits(getValues(`mintCount`), 0)}</span>
            </div>
            <Controller
              name='mintCount'
              control={control}
              rules={{
                required: true,
                validate: (value) => {
                  console.log(userBalance?.value, value)
                  if (userBalance?.value.lt(value)) {
                    return 'Insufficient balance'
                  }
                  return value.gt(0)
                },
              }}
              render={({ field }) => (
                <button
                  // disabled={
                  //   !userMintLeft || !session?.user?.id || !hasMintAllocation || BigNumber.from(getValues(`mintCount`)).eq(userMintLeft)
                  // }
                  className='border-l border-mediumGrey p-2 disabled:cursor-not-allowed'
                  onClick={(e) => {
                    // e.preventDefault()
                    if (userMintLeft && getValues(`mintCount`) < userMintLeft) {
                      setValue('mintCount', BigNumber.from(mintCount).add(1))
                    }
                  }}
                  {...field}
                  value={formatUnits(mintCount, 0)}
                  type='button'
                >
                  <MinusIcon className='w-2 h-2 text-darkGrey' />
                </button>
              )}
            />
          </div>
          {/* <DecrementIncrementInput
            maxValue={userMintLeft}
            onChange={(value) => setMintCount(value)}
            value={mintCount}
            disabled={!session?.user?.id || !hasMintAllocation}
          /> */}
        </div>
      </SaleLayout.Body>
      <SaleLayout.Footer>
        <div className='flex justify-between items-center'>
          <div>
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
            // disabled={!session?.user?.id || isLoading || !allowToMint}
            // onClick={() => {
            //   try {
            //     write()
            //   } catch (error) {
            //     console.error(error)
            //   }
            // }}
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
