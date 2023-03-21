function experiments(options) {
  if (options.environment !== 'development') return
  return {
    lazyCompilation: {
      entries: false,
      imports: true
    }
  }
}

module.exports = experiments