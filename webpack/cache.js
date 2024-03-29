const path = require('path')
const { version } = require('../package.json')

function cache(options) {
  if (!options.cache) return
  return {
    type: 'filesystem',
    cacheDirectory: path.posix.join(options.projectFolder, `.${options.environment}`, '.cache'),
    name: options.target,
    version,
  }
}

module.exports = cache