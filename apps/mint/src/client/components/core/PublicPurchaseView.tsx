import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMintPeriod } from 'src/client/hooks/contractsRead'
import { usePresaleMint } from 'src/client/hooks/usePresaleMint'
import { usePresaleRequirements } from 'src/client/hooks/usePresaleRequirements'
import { useWalletCheck } from 'src/client/hooks/useWalletCheck'
import { useAccount } from 'wagmi'

import { SaleLayout, SaleLayoutBody, SaleLayoutHeader } from './SaleLayout'
import { DecrementIncrementInput } from './UI/DecrementIncrementInput'

export const PublicPurchaseView = () => {
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
      <SaleLayoutHeader title='Public Sale' />
      <SaleLayoutBody>
        <form>
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
        </form>
      </SaleLayoutBody>
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
      {/* <div className='flex justify-end'>
        <div className='flex items-center space-x-3'>
          <span className='text-xs'>Total Minted</span>
          <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
          <div className='text-xs flex items-center justify-center space-x-1'>
            <span>
              <strong>0</strong>
            </span>
            <span>/ 10000</span>
          </div>
        </div>
      </div> */}
    </SaleLayout>
  )
}
