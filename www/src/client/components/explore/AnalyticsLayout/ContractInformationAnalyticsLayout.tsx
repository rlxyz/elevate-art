import { AnalyticsLayout } from '@components/explore/AnalyticsLayout/AnalyticsLayout'
import LinkComponent from '@components/layout/link/Link'
import type { ContractInformationData } from '@utils/contracts/ContractData'
import { buildEtherscanLink } from '@utils/ethers'
import { formatUnits } from 'ethers/lib/utils.js'
export const ContractInformationAnalyticsLayout = ({ contractInformationData }: { contractInformationData: ContractInformationData }) => {
  const { name, symbol, owner, mintType, chainId, collectionSize } = contractInformationData

  console.log('ContractInformationAnalyticsLayout', contractInformationData)

  return (
    <AnalyticsLayout>
      <AnalyticsLayout.Header title='Contract Information' />
      <AnalyticsLayout.Body>
        <div className='flex flex-col space-y-3'>
          {[
            { key: 'Name', value: name || '' },
            { key: 'Symbol', value: symbol || '' },
            {
              key: 'Owner',
              value: buildEtherscanLink({
                address: owner,
                chainId: chainId || 99,
              }),
              type: 'Link',
            },
            { key: 'Blockchain', value: chainId },
            { key: 'Mint Type', value: mintType },
            { key: 'Total Supply', value: formatUnits(collectionSize, 18), type: 'Basic' },
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
