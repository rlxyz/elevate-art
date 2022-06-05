const plugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'nosources-source-map',
})
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')

const withOffline = require('next-offline')

const {
  COMMIT_HASH,
  NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  NEXT_PUBLIC_ROLLBAR_SERVER_TOKEN,
  NEXT_PUBLIC_ASSET_PUBLIC_PATH,
} = process.env

const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  webpack(config, { webpack, dev, isServer, buildId }) {
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
      }),
    )

    // audio support
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    })

    if (!dev) {
      /* eslint-disable-next-line no-param-reassign */
      config.output.futureEmitAssets = false
      const codeVersion = JSON.stringify(buildId)
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_PUBLIC_BUILD_ID': codeVersion,
        }),
      )
      config.plugins.push(
        new RollbarSourceMapPlugin({
          accessToken: NEXT_PUBLIC_ROLLBAR_SERVER_TOKEN,
          version: codeVersion,
          publicPath: NEXT_PUBLIC_ASSET_PUBLIC_PATH,
        }),
      )
    }

    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })

    return config
  },
}

// manage i18n
if (process.env.EXPORT !== 'true') {
  nextConfig.i18n = {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  }
}

nextConfig.images = {
  domains: [
    'rlwxyz.nyc3.cdn.digitaloceanspaces.com',
    'rlyxz.nyc3.cdn.digitaloceanspaces.com',
  ],
}

module.exports = plugins([withBundleAnalyzer, withSourceMaps], nextConfig)
