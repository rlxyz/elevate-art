const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === true,
})
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')

const { NEXT_PUBLIC_ROLLBAR_SERVER_TOKEN, NEXT_PUBLIC_ASSET_PUBLIC_PATH } = process.env

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  webpack5: (config, { webpack, dev, isServer, buildId }) => {
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
  images: {
    domains: [
      'rlwxyz.nyc3.cdn.digitaloceanspaces.com',
      'rlyxz.nyc3.cdn.digitaloceanspaces.com',
    ],
  },
}

module.exports = (_phase, { defaultConfig }) => {
  const plugins = [withBundleAnalyzer]
  return plugins.reduce((acc, plugin) => plugin(acc), { ...defaultConfig, ...nextConfig })
}
