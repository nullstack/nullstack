function target(options) {
  return options.target == 'client' ? 'web' : 'node'
}

module.exports = target