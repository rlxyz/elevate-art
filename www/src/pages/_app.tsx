import { EthereumAuthenticationLayout } from '@components/layout/core/EthereumAuthenticationLayout'
import { ErrorBoundary } from '@highlight-run/react'
import '@rainbow-me/rainbowkit/styles.css'
import { Session } from 'next-auth/core/types'
import { AppType } from 'next/app'
import { AnalyticsLayout } from '../client/components/layout/core/AnalyticsLayout'
import { StoreLayout } from '../client/components/layout/core/StoreLayout'
import '../client/styles/globals.css'
import '../client/utils/highlight'
import { trpc } from '../client/utils/trpc'
export { reportWebVitals } from 'next-axiom'

const ElevateCompilerApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ErrorBoundary showDialog>
      <EthereumAuthenticationLayout session={session}>
        <AnalyticsLayout>
          <StoreLayout>
            <Component {...pageProps} />
          </StoreLayout>
        </AnalyticsLayout>
      </EthereumAuthenticationLayout>
    </ErrorBoundary>
  )
}

export default trpc.withTRPC(ElevateCompilerApp)
