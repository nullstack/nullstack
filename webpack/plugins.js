function css(options) {
  if (options.target !== 'client') return false

  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  return new MiniCssExtractPlugin({
    filename: `${options.target}.css`,
    chunkFilename: `[chunkhash].${options.target}.css`,
  })
}

function hmr(options) {
  if (options.environment !== 'development') return false

  const { HotModuleReplacementPlugin } = require('webpack')
  return new HotModuleReplacementPlugin()
}

function copy(options) {
  if (!options.disk) return false

  const CopyPlugin = require('copy-webpack-plugin')
  return new CopyPlugin({
    patterns: [
      { from: 'public', to: `../${options.buildFolder}` }
    ],
  })
}

function nodemon(options) {
  if (options.environment !== 'development') return false
  if (options.target !== 'server') return false

  const NodemonPlugin = require('nodemon-webpack-plugin')
  return new NodemonPlugin({
    ext: '*',
    watch: ['.env', '.env.*', './server.js'],
    script: './.development/server.js',
    nodeArgs: ['--enable-source-maps'],
    quiet: true,
  })
}

function plugins(options) {
  return [
    css(options),
    hmr(options),
    copy(options),
    nodemon(options)
  ].filter(Boolean)
}

module.exports = plugins