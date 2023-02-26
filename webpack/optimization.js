const TerserPlugin = require('terser-webpack-plugin')
const swc = require('@swc/core')

function terserMinimizer(file) {
  return swc.minify(file, {
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