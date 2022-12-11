import '@rainbow-me/rainbowkit/styles.css'
import 'react-medium-image-zoom/dist/styles.css'
import '../client/styles/globals.css'

import { AnalyticsLayout } from '@Components/ui/core/AnalyticsLayout'
import { EthereumAuthenticationLayout } from '@Components/ui/core/EthereumAuthenticationLayout'
import { trpc } from '@Utils/trpc'
import type { Session } from 'next-auth/core/types'
import type { AppType } from 'next/app'

const Application: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <EthereumAuthenticationLayout session={session}>
      <AnalyticsLayout>
        <Component {...pageProps} />
      </AnalyticsLayout>
    </EthereumAuthenticationLayout>
  )
}

export default trpc.withTRPC(Application)
