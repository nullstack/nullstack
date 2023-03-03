function devtool(options) {
  if (options.environment === 'development') {
    return 'eval-cheap-module-source-map'
  } else {
    return 'hidden-source-map'
  }
}

module.exports = devtool