import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMintPeriod } from 'src/client/hooks/contractsRead'
import { usePresaleMint } from 'src/client/hooks/usePresaleMint'
import { usePresaleRequirements } from 'src/client/hooks/usePresaleRequirements'
import { useWalletCheck } from 'src/client/hooks/useWalletCheck'
import { useAccount } from 'wagmi'

import { DecrementIncrementInput } from '../core/UI/DecrementIncrementInput'
import { SaleLayout } from './SaleLayout'

export const SaleLayoutPublicPurchase = () => {
  const { isConnected, isDisconnected, address } = useAccount()
  const [mintCount, setMintCount] = useState(1)
  const { publicTime } = useMintPeriod()
  const { maxAllocation, userAllocation, hasMintAllocation, allowToMint, userMintCount } = usePresaleRequirements({ address })
  const { mint, isLoading, isError } = usePresaleMint({ address })

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

  const { validateAllowlist } = useWalletCheck()
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
      <SaleLayout.Header title='Public Sale' />
      <SaleLayout.Body>
        <div className='flex justify-between items-center'>
          <div className='space-y-1'>
            <h3 className='text-[0.6rem] text-darkGrey uppercase'>Price</h3>
            <div className='text-3xl text-black font-semibold space-x-3 italic'>
              <span className='leading-1 tracking-tighter'>0.005</span>
              <span>ETH</span>
            </div>
          </div>
          <div>
            <DecrementIncrementInput
              maxValue={maxAllocation}
              onChange={(value) => setMintCount(value)}
              value={mintCount}
              disabled={isDisconnected || !hasMintAllocation}
            />
          </div>
        </div>
      </SaleLayout.Body>
      <SaleLayout.Footer>
        <div className='flex justify-end'>
          <button
            disabled={isDisconnected || isLoading || !allowToMint}
            onClick={() => mint(mintCount)}
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
