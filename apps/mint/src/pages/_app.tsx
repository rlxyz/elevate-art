import '@elevateart/ui/styles/globals.css'
// import 'react-medium-image-zoom/dist/styles.css'

import { QueryClient } from '@tanstack/react-query'
import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/app'

const queryClient = new QueryClient()

const ElevateMintApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {/* <EthereumNextAuthContext session={pageProps.session}> */}
      {/* <QueryClientProvider client={queryClient}> */}
      <DefaultSeo
        title='elevate_mint.png hmm'
        description='a general purpose mint client for nft projects'
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://elevate.art/',
          site_name: 'elevate.art',
        }}
        twitter={{
          handle: '@elevate_art',
          cardType: 'summary',
        }}
      />
      <Component {...pageProps} />
      {/* </QueryClientProvider> */}
      {/* </EthereumNextAuthContext> */}
    </>
  )
}

export default ElevateMintApp
