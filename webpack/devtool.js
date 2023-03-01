function devtool(options) {
  if (options.environment === 'development') {
    return 'hidden-cheap-module-source-map'
  } else {
    return 'source-map'
  }
}

module.exports = devtool