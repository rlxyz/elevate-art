import { SaleLayout } from './SaleLayout'

export const SaleLayoutLoading = () => {
  return (
    <SaleLayout className='bg-mediumGrey/70 animate-pulse-gradient-infinite'>
      <SaleLayout.Header className='invisible' title='Allowlist Check' startingDate={{ label: 'Presale Starts In', value: new Date() }} />
      <SaleLayout.Body className='invisible'>
        <span className='text-xs'>
          Check if your Wallet Address is on the <strong className='uppercase italic'>allowlist</strong>
        </span>
        <div className='w-full flex flex-row space-x-3'></div>
      </SaleLayout.Body>
      <SaleLayout.Footer className='invisible'>
        <button className='bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:text-darkGrey disabled:cursor-not-allowed border border-mediumGrey px-3 py-1 rounded-[5px]'>
          Mint
        </button>
      </SaleLayout.Footer>
    </SaleLayout>
  )
}
