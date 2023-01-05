import { AnalyticsLayout } from '@components/explore/AnalyticsLayout/AnalyticsLayout'
import LinkComponent from '@components/layout/link/Link'
import type { PayoutData } from '@utils/contracts/ContractData'
import { formatUnits } from 'ethers/lib/utils.js'

export const ContractPayoutAnalyticsLayout = ({ title, payoutData }: { title: string; payoutData: PayoutData | undefined | null }) => {
  if (!payoutData) return null
  return (
    <AnalyticsLayout>
      <AnalyticsLayout.Header title={title} />
      <AnalyticsLayout.Body>
        <div className='flex flex-col space-y-3'>
          {[
            { key: 'Esimated Payout', value: formatUnits(payoutData?.estimatedPayout), type: 'Basic' },
            { key: 'Payment Receiver', value: payoutData?.paymentReceiver, type: 'Link' },
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
