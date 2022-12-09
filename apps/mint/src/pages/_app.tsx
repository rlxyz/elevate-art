import '@rainbow-me/rainbowkit/styles.css'
import 'react-medium-image-zoom/dist/styles.css'
import '../client/styles/globals.css'

import { AnalyticsLayout } from '@Components/layout/core/AnalyticsLayout'
import { EthereumAuthenticationLayout } from '@Components/layout/core/EthereumAuthenticationLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '@Utils/trpc'
import { Session } from 'next-auth/core/types'
import { AppType } from 'next/app'

const queryClient = new QueryClient()

const Application: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  // useEffect(() => {
  //   LogRocket.init(config.logrocketKey)
  // }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <EthereumAuthenticationLayout session={session}>
        <AnalyticsLayout>
          <Component {...pageProps} />
        </AnalyticsLayout>
      </EthereumAuthenticationLayout>
    </QueryClientProvider>
  )
}

export default trpc.withTRPC(Application)
