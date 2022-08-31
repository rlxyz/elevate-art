import Head from 'next/head'
import React from 'react'

interface SeoProps {
  title?: string
  description?: string
}

export const Seo: React.FC<SeoProps> = ({ title = 'Home', description }) => {
  return (
    <Head>
      {/* Recommended meta tags */}
      <meta charSet='utf-8' />
      <meta name='language' content='english' />
      <meta httpEquiv='content-type' content='text/html' />
      <meta name='author' content='elevate.art' />
      <meta name='designer' content='elevate.art' />
      <meta name='publisher' content='elevate.art' />

      {/* Search Engine Optimization Meta Tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content='nft,genart,compiler,photography,fidenza,subscapes,tylehobbs' />
      <meta name='robots' content='index,follow' />
      <meta name='distribution' content='web' />

      {/* Facebook Open Graph meta tags */}
      <meta name='og:title' content='elevate.art' />
      <meta name='og:description' content='elevating generative art, one compilation at a time' />
      <meta name='og:type' content='site' />
      <meta
        name='og:image'
        content='https://rlxyz.nyc3.cdn.digitaloceanspaces.com/dreamlab/reflections/landing-client/opengraph-image.png'
      />
      <meta name='og:url' content='https://elevart.art' />
      <meta name='og:author' content='elevate.art' />
      <meta name='og:site_name' content='elevate.art' />

      {/* Twitter Card meta tags */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@elevart_art' />
      <meta name='twitter:title' content='elevate.art' />
      <meta name='twitter:description' content='elevate.art' />
      <meta
        name='twitter:image'
        content='https://rlxyz.nyc3.cdn.digitaloceanspaces.com/dreamlab/reflections/landing-client/twitter-image.png'
      />

      <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1.0' />
      <meta name='theme-color' content='#000' />
      <link rel='shortcut icon' href='/favicon.ico' />
    </Head>
  )
}
