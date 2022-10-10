const darkCodeTheme = require('prism-react-renderer/themes/dracula')
const math = require('remark-math')
const katex = require('rehype-katex')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Elevate Art Docs',
  url: 'https://docs.elevate.art',
  baseUrl: '/',
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo_white.svg',
  organizationName: 'elevate.art',
  projectName: 'Elevate Art Docs',
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Elevat Art Logo',
        src: 'img/logo_white.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Intro',
          to: '/docs/intro_to_elevate_art',
        },
        {
          position: 'left',
          label: 'Generator',
          to: '/docs/generator/upload-art',
        },
        {
          position: 'left',
          label: 'Smart Contracts',
          to: '/docs/smart-contracts/zora-v3',
        },
        {
          position: 'left',
          label: 'Mint Client',
          to: '/docs/mint-client/intro',
        },
      ],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
    },
    prism: {
      theme: darkCodeTheme,
      additionalLanguages: ['solidity', 'graphql'],
    },
    algolia: {
      apiKey: 'ea9711802399936fa4d55c3033c4cfc5',
      indexName: 'zora',
      appId: 'BH4D9OD16A',
    },
    footer: {
      style: 'dark',
    },
    image: 'img/previewImage.png',
    ...(process.env.GTAG_ID && {
      gtag: {
        trackingID: process.env.GTAG_ID,
        anonymizeIP: true,
      },
    }),
    metadatas: [
      {
        name: 'title',
        content: 'Elevate Art Docs',
      },
      {
        name: 'og:description',
        content:
          'Design your NFT collection with our leading art generator. Build the perfect collection for your community. Upload your base images, tweak your layers, and algorithmically generate your full collection.',
      },
      {
        name: 'description',
        content:
          'Design your NFT collection with our leading art generator. Build the perfect collection for your community. Upload your base images, tweak your layers, and algorithmically generate your full collection.',
      },
    ],
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/ourzora/zora-docs/blob/main',
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        guides: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
      },
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css',
      integrity:
        'sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc',
      crossorigin: 'anonymous',
    },
  ],
  plugins: [
    [
      'docusaurus2-dotenv',
      {
        safe: false,
        systemvars: true,
        silent: false,
        expand: false,
        defaults: true,
      },
    ],
  ],
}
