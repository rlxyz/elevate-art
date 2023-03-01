import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import { ContractDeploymentAllowlistType } from '@prisma/client'
import type { RhapsodyContractData } from '@utils/contracts/ContractData'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getAddressFromEns } from 'src/client/utils/ethers'
import { useMintLayoutCurrentTime } from '../MintLayout/useMintLayoutCurrentTime'
import { SaleLayout } from './SaleLayout'
import { useQueryContractDeploymentWhitelistFindClaimByAddress } from './useQueryContractDeploymentWhitelistFindClaimByAddress'

export const SaleLayoutClaimChecker = ({ contractData }: { contractData: RhapsodyContractData }) => {
  const { all } = useQueryContractDeploymentWhitelistFindClaimByAddress({
    type: ContractDeploymentAllowlistType.CLAIM,
  })
  const { now } = useMintLayoutCurrentTime()
  const [addressCheckerDetails, setAddressCheckerDetails] = useState<null | { address: string; mint: number }>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ address: string }>({
    defaultValues: {
      address: '',
    },
  })

  const reset = () => {
    setAddressCheckerDetails(null)
  }

  return (
    <SaleLayout>
      {now > contractData.claimPeriod.startTimestamp ? (
        <SaleLayout.Header title='Claim Check' startingDate={{ label: 'Claim period has ended' }} />
      ) : (
        <SaleLayout.Header
          title='Claim Check'
          startingDate={
            now < contractData.claimPeriod.startTimestamp
              ? { label: 'Claim Starts In', value: contractData.claimPeriod.startTimestamp }
              : { label: 'Claim Ends In', value: contractData.presalePeriod.startTimestamp }
          }
        />
      )}
      <SaleLayout.Body
        onSubmit={handleSubmit((data) => {
          /** Reset all existing state */
          reset()
          if (!all) return setError('address', { message: 'Please try again in a minute' })

          /** Check if the address has a claim */
          const claim = all.find((c) => c.address.toLowerCase() === data.address.toLowerCase())
          if (!claim) {
            return setError('address', { message: 'This address does not have a claim' })
          }

          setAddressCheckerDetails({ address: data.address, mint: claim.mint })
        })}
        className='flex flex-col space-y-3'
      >
        <span className='text-xs'>
          Check if your Wallet Address can <strong className='uppercase'>claim</strong> an NFT
        </span>
        <div className='w-full flex flex-row space-x-3'>
          <input
            className={clsx(
              'text-xs p-2 w-full border border-mediumGrey rounded-[5px]',
              'invalid:border-redError invalid:text-redError',
              'focus:invalid:border-redError focus:invalid:ring-redError',
              'focus:outline-none focus:ring-1 focus:border-blueHighlight focus:ring-blueHighlight'
            )}
            aria-invalid={errors.address ? 'true' : 'false'}
            placeholder='0xd2a420... or alpha.eth...'
            {...register('address', {
              required: true,
              validate: async (v) => {
                reset()
                if (!all) return 'Please try again in a minute'

                /** First we check whether it is a valid address */
                let address = ''
                if (String(v).endsWith('.eth')) {
                  const addr = await getAddressFromEns(v)
                  if (!addr || !ethers.utils.isAddress(addr)) return 'Please enter a valid ENS'
                  address = addr
                } else {
                  if (!ethers.utils.isAddress(v)) return 'Please enter a valid Ethereum address'
                  address = v
                }

                return true
              },
            })}
          />
          <button
            type='submit'
            className='bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:text-darkGrey disabled:cursor-not-allowed border border-mediumGrey p-2 rounded-[5px]'
          >
            Check
          </button>
        </div>
        {errors.address ? (
          <span className='mt-2 col-span-10 text-xs w-full text-redError flex items-center space-x-1'>
            <ExclamationCircleIcon className='text-redError w-4 h-4' />
            <span>{String(errors?.address?.message) || 'Something went wrong...'}</span>
          </span>
        ) : null}
        {addressCheckerDetails ? (
          <span className='mt-2 col-span-10 text-xs w-full text-greenDot flex items-center space-x-1'>
            <CheckCircleIcon className='text-greenDot w-4 h-4' />
            <span>{`This address has ${addressCheckerDetails.mint} mints for this phase`}</span>
          </span>
        ) : null}
      </SaleLayout.Body>
    </SaleLayout>
  )
}
