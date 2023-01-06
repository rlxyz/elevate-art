import { AnalyticsLayout } from '@components/explore/AnalyticsLayout/AnalyticsLayout'
import LinkComponent from '@components/layout/link/Link'
import type { ContractInformationData } from '@utils/contracts/ContractData'
import { buildEtherscanLink, parseChainId } from '@utils/ethers'
import { formatUnits } from 'ethers/lib/utils.js'
import { capitalize } from 'src/client/utils/format'

export const ContractInformationAnalyticsLayout = ({ contractInformationData }: { contractInformationData: ContractInformationData }) => {
  const { name, symbol, owner, mintType, chainId, collectionSize } = contractInformationData

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
              title: owner.substring(0, 6) + '...' + owner.substring(owner.length - 4, owner.length),
              type: 'Link',
              disabled: owner === '0x' ? true : false,
            },
            { key: 'Blockchain', value: capitalize(parseChainId(chainId)) },

            { key: 'Mint Type', value: mintType },
            { key: 'Total Supply', value: formatUnits(collectionSize, 0), type: 'Basic' },
          ].map(({ key, value, title, type = 'Basic', disabled = false }) => (
            <article key={key} className='flex justify-between w-full'>
              <h3 className='text-xs'>{key}</h3>
              {/* { && <span className='text-xs'>Not Available</span>} */}
              {!disabled && type === 'Link' && (
                <LinkComponent icon className='w-fit' href={value} underline rel='noreferrer nofollow' target='_blank'>
                  <span className='text-xs'>{title || 'Explore'}</span>
                </LinkComponent>
              )}
              {!disabled && type === 'Basic' && <span className='text-xs'>{value}</span>}
            </article>
          ))}
        </div>
      </AnalyticsLayout.Body>
    </AnalyticsLayout>
  )
}
