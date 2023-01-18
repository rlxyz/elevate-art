import { EthereumAuthenticationLayout } from '@components/layout/core/EthereumAuthenticationLayout'
import { ErrorBoundary } from '@highlight-run/react'
import '@rainbow-me/rainbowkit/styles.css'
import type { Session } from 'next-auth/core/types'
import type { AppType } from 'next/app'
import { AnalyticsLayout } from '../client/components/layout/core/AnalyticsLayout'
import '../client/styles/globals.css'
import '../client/utils/highlight'
import { trpc } from '../client/utils/trpc'
export { reportWebVitals } from 'next-axiom'

const Application: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ErrorBoundary showDialog>
      <EthereumAuthenticationLayout session={session}>
        <AnalyticsLayout>
          <Component {...pageProps} />
        </AnalyticsLayout>
      </EthereumAuthenticationLayout>
    </ErrorBoundary>
  )
}

export default trpc.withTRPC(Application)
