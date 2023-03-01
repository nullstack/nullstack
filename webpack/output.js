const path = require('path')

function output(options) {
  return {
    publicPath: `/`,
    path: path.posix.join(options.projectFolder, options.buildFolder),
    filename: `${options.target}.js`,
    chunkFilename: `[chunkhash].${options.target}.js`,
    hotUpdateChunkFilename: `nullstack-${options.target}-update-[id]-[fullhash].js`,
    hotUpdateMainFilename: `nullstack-${options.target}-update-[runtime]-[fullhash].json`,
    pathinfo: false,
    libraryTarget: 'umd',
    clean: {
      keep(asset) {
        return options.environment === 'production' || !asset.includes(options.target)
      },
    }
  }
}

module.exports = output