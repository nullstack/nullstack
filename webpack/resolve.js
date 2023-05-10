const path = require('path')

function resolve(options) {
  return {
    extensions: ['.njs', '.js', '.nts', '.ts', '.tsx', '.jsx'],
    alias: {
      nullstack: path.join(options.configFolder, options.target),
    }
  }
}

module.exports = resolve