function experiments(options) {
  return // temporarily disabled
  if (options.environment !== 'development') return
  return {
    lazyCompilation: {
      entries: false,
      imports: true
    }
  }
}

module.exports = experiments