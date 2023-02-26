const path = require('path')

function client(options) {
  if (options.environment === 'production') {
    return options.entry
  }
  return [
    'webpack-hot-middleware/client?log=false&path=/nullstack/hmr&noInfo=true&quiet=true&timeout=1000&reload=true',
    path.posix.join(options.configFolder, 'shared', 'accept.js'),
    options.entry
  ]
}

function server(options) {
  if (options.environment === 'production') {
    return options.entry
  }
  return [
    'webpack/hot/poll?1000',
    path.posix.join(options.configFolder, 'shared', 'accept.js'),
    options.entry
  ]
}

function entry(options) {
  if (options.target == 'client') {
    return client(options)
  } else {
    return server(options)
  }
}

module.exports = entry