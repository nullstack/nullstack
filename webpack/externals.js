function client(options) {
  if (options.environment === 'production') {
    return {}
  }
  return {
    'webpack-hot-middleware/client':
      'webpack-hot-middleware/client?log=false&path=/nullstack/hmr&noInfo=true&quiet=true&timeout=1000&reload=true',
  }
}

function server(options) {
  if (options.environment === 'production') {
    return {}
  }
  return {
    'webpack/hot/poll': 'webpack/hot/poll?100'
  }
}

function externals(options) {
  if (options.target == 'client') {
    return client(options)
  } else {
    return server(options)
  }
}

module.exports = externals