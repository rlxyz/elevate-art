import LinkComponent from '@components/layout/link/Link'
import type { ContractDeployment } from '@prisma/client'
import { buildEtherscanLink, parseChainId } from '@utils/ethers'
import { capitalize } from 'src/client/utils/format'
import { AnalyticsLayout } from './AnalyticsLayout'

export const AnalyticsLayoutCollectionInformation = ({
  contractDeployment,
}: {
  contractDeployment: ContractDeployment | null | undefined
}) => (
  <AnalyticsLayout>
    <AnalyticsLayout.Header title='Information' />
    <AnalyticsLayout.Body>
      <div className='flex flex-col space-y-3'>
        {[
          {
            key: 'Contract Address',
            value: buildEtherscanLink({
              address: contractDeployment?.address || '',
              chainId: contractDeployment?.chainId || 1,
            }),
            type: 'Link',
          },
          { key: 'Blockchain', value: capitalize(parseChainId(contractDeployment?.chainId || 99)), type: 'Basic' },
          { key: 'Token Standard', value: 'ERC721', type: 'Basic' },
          // { key: 'Base Image URI', value: 'Explore', type: 'Link' },
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
