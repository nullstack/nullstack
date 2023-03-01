const TerserPlugin = require('terser-webpack-plugin')

function terserMinimizer(file) {
  return require('@swc/core').minify(file, {
    mangle: false,
    compress: {
      unused: false,
    },
    keepClassnames: true,
    keepFnames: true,
    sourceMap: true,
  })
}

function optimization(options) {
  return {
    minimize: options.environment === 'production',
    minimizer: [
      new TerserPlugin({
        minify: terserMinimizer,
      }),
    ],
  }
}

module.exports = optimization