import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { getAddressFromEns } from '@Utils/ethers'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { useForm } from 'react-hook-form'
import { useMintPeriod } from 'src/client/hooks/contractsRead'
import { useWalletCheck } from 'src/client/hooks/useWalletCheck'

import { SaleLayout, SaleLayoutBody, SaleLayoutHeader } from './SaleLayout'

export const AllowlistCheckerView = () => {
  const { validateAllowlist } = useWalletCheck()
  const { presaleTime } = useMintPeriod()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ address: string }>({
    defaultValues: {
      address: '',
    },
  })

  return (
    <SaleLayout>
      <SaleLayoutHeader title='Allowlist Check' endingDate={new Date(presaleTime)} />
      <SaleLayoutBody>
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data)
          })}
          className='flex flex-col space-y-3'
        >
          <span className='text-xs'>
            Check if your Wallet Address is on the <strong className='uppercase italic'>allowlist</strong>
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

                  if (!validateAllowlist({ address })) return 'Address is not in the allowlist'

                  return true
                },
                // onChange: (e) => setAddress(e.currentTarget.value),
              })}
            />
            <button
              // disabled={!checkWallet}
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
        </form>
      </SaleLayoutBody>
    </SaleLayout>
  )
}
