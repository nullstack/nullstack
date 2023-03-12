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
  const dotenv = options.name ? `.env.${options.name}` : '.env'
  return new NodemonPlugin({
    ext: '*',
    watch: [dotenv, './server.js'],
    script: './.development/server.js',
    nodeArgs: ['--enable-source-maps'],
    quiet: true,
  })
}

function wait(options) {
  if (options.target !== 'server') return
  if (options.environment !== 'development') return

  const { writeFile } = require('fs')
  const path = require('path')
  class WaitCompilerPlugin {
    apply(compiler) {
      compiler.hooks.watchRun.tap('WaitCompilerPlugin', () => {
        writeFile(path.join(options.buildFolder, '.compiling'), '', () => { })
      });
    }
  }
  return new WaitCompilerPlugin()
}

function plugins(options) {
  return [
    css(options),
    hmr(options),
    copy(options),
    nodemon(options),
    wait(options),
  ].filter(Boolean)
}

module.exports = plugins