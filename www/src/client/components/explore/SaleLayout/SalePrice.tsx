import { BigNumber, ethers } from 'ethers'

export const SalePrice = ({ mintPrice, quantity }: { mintPrice: BigNumber; quantity: BigNumber }) => {
  const mintPriceFormatted = ethers.utils.formatUnits(BigNumber.from(mintPrice).mul(BigNumber.from(quantity)), 18)
  return (
    <div className='space-y-1'>
      <h3 className='text-[0.6rem] text-darkGrey uppercase'>Price</h3>
      <div className='text-3xl text-black font-semibold space-x-3 italic'>
        <span className='leading-1 tracking-tighter'>{mintPriceFormatted}</span>
        <span>ETH</span>
      </div>
    </div>
  )
}
