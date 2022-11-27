import { Analytics } from '@vercel/analytics/react'
import { DefaultSeo } from 'next-seo'
import { FC, ReactNode } from 'react'
import { env } from 'src/env/client.mjs'

export const AnalyticsLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <DefaultSeo
        title='Elevate Art'
        description='Design your NFT collection with our leading art generator. Build the perfect collection for your community. Upload your base images, tweak your layers, and algorithmically generate your full collection.'
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://elevate.art/',
          site_name: 'elevate.art',
          images: [
            {
              url: 'https://uploads-ssl.webflow.com/62fb25dec6d6000039acf36b/630df414a98b27db93462c57_Open%20Graph.png',
              width: 1600,
              height: 840,
              alt: 'Elevate Art',
            },
          ],
        }}
        twitter={{
          handle: '@elevate_art',
          cardType: 'summary',
        }}
      />
      {children}
      <Analytics debug={!(env.NEXT_PUBLIC_NODE_ENV === 'production')} />
    </>
  )
}
