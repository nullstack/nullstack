function js() {
  const TerserPlugin = require('terser-webpack-plugin')
  return new TerserPlugin({
    minify: TerserPlugin.swcMinify,
    terserOptions: {
      mangle: false,
      compress: {
        unused: false,
      },
      keepFnames: true,
      sourceMap: true,
    }
  })
}

function css(options) {
  if (options.target !== 'client') return false
  const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
  return new CssMinimizerPlugin({
    minify: CssMinimizerPlugin.lightningCssMinify,
  })
}

function optimization(options) {
  return {
    minimize: options.environment === 'production',
    minimizer: [js(options), css(options)].filter(Boolean),
  }
}

module.exports = optimization