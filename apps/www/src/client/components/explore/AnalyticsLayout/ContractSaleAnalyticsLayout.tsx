import { AnalyticsLayout } from '@components/explore/AnalyticsLayout/AnalyticsLayout'
import LinkComponent from '@components/layout/link/Link'
import type { ContractInformationData, SaleConfig } from '@utils/contracts/ContractData'
import { parseChainIdCurrency } from '@utils/ethers'
import { formatEther } from 'ethers/lib/utils.js'

export const ContractSaleAnalyticsLayout = ({
  title,
  saleConfig,
  contractInformationData,
}: {
  title: string
  saleConfig: SaleConfig | undefined | null
  contractInformationData: ContractInformationData | undefined | null
}) => {
  return (
    <AnalyticsLayout>
      <AnalyticsLayout.Header title={title} />
      <AnalyticsLayout.Body>
        <div className='flex flex-col space-y-3'>
          {[
            { key: 'Start Timestamp', value: saleConfig?.startTimestamp.toLocaleString(), type: 'Basic' },
            {
              key: 'Mint Price',
              value:
                saleConfig?.mintPrice && contractInformationData
                  ? `${formatEther(saleConfig.mintPrice.toString())} ${parseChainIdCurrency(contractInformationData?.chainId)}`
                  : '0',
              type: 'Basic',
            },
            { key: 'Max Mint Per Address', value: saleConfig?.maxMintPerAddress.toString(), type: 'Basic' },
          ].map(({ key, value, type }) => (
            <article key={key} className='flex justify-between w-full'>
              <h3 className='text-xs'>{key}</h3>
              {type === 'Link' ? (
                <LinkComponent icon className='w-fit' href={value} underline rel='noreferrer nofollow' target='_blank'>
                  <span className='text-xs'>Explore</span>
                </LinkComponent>
              ) : (
                <span className='text-xs'>{value}</span>
              )}
            </article>
          ))}
        </div>
      </AnalyticsLayout.Body>
    </AnalyticsLayout>
  )
}
