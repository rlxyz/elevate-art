import { parseChainIdCurrency } from '@utils/ethers'
import { BigNumber, ethers } from 'ethers'

export const SalePrice = ({ mintPrice, quantity, chainId }: { mintPrice: BigNumber; quantity: BigNumber; chainId: number }) => {
  const mintPriceFormatted = BigNumber.from(mintPrice).mul(BigNumber.from(quantity))
  return (
    <div className='space-y-1'>
      <h3 className='text-[0.6rem] text-darkGrey uppercase'>Price</h3>
      <div className='text-3xl text-black font-semibold space-x-3'>
        {mintPriceFormatted.eq(0) ? (
          <span className='leading-1 uppercase'>Free</span>
        ) : (
          <>
            <span className='leading-1 tracking-tighter'>{ethers.utils.formatUnits(mintPriceFormatted, 18)}</span>
            <span>{parseChainIdCurrency(chainId)}</span>
          </>
        )}
      </div>
    </div>
  )
}
