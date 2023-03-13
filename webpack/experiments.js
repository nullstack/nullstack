function experiments(options) {
  if (options.environment !== 'development') return false
  return {
    lazyCompilation: {
      entries: false,
      imports: true
    }
  }
}

module.exports = experiments