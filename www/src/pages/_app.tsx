// src/pages/_app.tsx
import { EthereumAuthenticationLayout } from '@components/layout/core/EthereumAuthenticationLayout'
import { ErrorBoundary } from '@highlight-run/react'
import '@rainbow-me/rainbowkit/styles.css'
import { Session } from 'next-auth'
import { AppType } from 'next/app'
import { createOrganisationNavigationStore, OrganisationRouterContext } from 'src/client/hooks/store/useOrganisationNavigationStore'
import { createRepositoryStore, RepositoryContext } from 'src/client/hooks/store/useRepositoryStore'
import { AnalyticsLayout } from '../client/components/layout/core/AnalyticsLayout'
import '../client/styles/globals.css'
import '../client/utils/highlight'
import { trpc } from '../client/utils/trpc'
export { reportWebVitals } from 'next-axiom'

const ElevateCompilerApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ErrorBoundary showDialog>
      <EthereumAuthenticationLayout session={session}>
        <AnalyticsLayout>
          <OrganisationRouterContext.Provider createStore={() => createOrganisationNavigationStore}>
            <RepositoryContext.Provider createStore={() => createRepositoryStore}>
              <Component {...pageProps} />
            </RepositoryContext.Provider>
          </OrganisationRouterContext.Provider>
        </AnalyticsLayout>
      </EthereumAuthenticationLayout>
    </ErrorBoundary>
  )
}

export default trpc.withTRPC(ElevateCompilerApp)
