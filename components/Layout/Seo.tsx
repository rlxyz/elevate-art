import Head from "next/head";

export const NAMINGS = {
  title: "REFLECTIONS",
  description:
    "Reflections is a first of its kind generative photography project that harnesses the serendipity of on-chain mechanics to compose 1,111 unique one of a kind NFTs.",
  author: {
    DREAMLAB: "Dream Lab",
    RLXYZ: "RLXYZ",
  },
  keywords: "nft,crypto,generative art,photography,cryptoart",
};

export const Seo = () => {
  return (
    <Head>
      {/* Recommended meta tags */}
      <meta charSet="utf-8" />
      <meta name="language" content="english" />
      <meta httpEquiv="content-type" content="text/html" />
      <meta name="author" content={"Jacob Riglin"} />
      <meta name="designer" content={NAMINGS.author.RLXYZ} />
      <meta name="publisher" content={NAMINGS.author.DREAMLAB} />

      {/* Search Engine Optimization Meta Tags */}
      <title>{NAMINGS.title} - Mint</title>
      <meta name="description" content={NAMINGS.description} />
      <meta name="keywords" content={`${NAMINGS.keywords}`} />
      <meta name="robots" content="index,follow" />
      <meta name="distribution" content="web" />

      {/* Facebook Open Graph meta tags */}
      <meta name="og:title" content={NAMINGS.title} />
      <meta name="og:description" content={NAMINGS.description} />
      <meta name="og:type" content="site" />
      <meta
        name="og:image"
        content="https://rlxyz.nyc3.cdn.digitaloceanspaces.com/dreamlab/reflections/landing-client/opengraph-image.png"
      />
      <meta name="og:url" content="https://reflections.dreamlab.art" />
      <meta name="og:author" content={NAMINGS.author.DREAMLAB} />
      <meta name="og:author" content={NAMINGS.author.RLXYZ} />
      <meta name="og:site_name" content={NAMINGS.title} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@dreamlab" />
      <meta name="twitter:title" content="REFLECTIONS by Dream Lab" />
      <meta name="twitter:description" content={NAMINGS.description} />
      <meta
        name="twitter:image"
        content="https://rlxyz.nyc3.cdn.digitaloceanspaces.com/dreamlab/reflections/landing-client/twitter-image.png"
      />

      <meta
        name="viewport"
        content="width=device-width, minimum-scale=1, initial-scale=1.0"
      />
      <meta name="theme-color" content="#000" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
  );
};
