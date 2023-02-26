const glob = require('glob')
const path = require('path')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')

const [server, client] = require('../webpack.config')

function applyAliases(environments) {
  return environments.map((environment) => (...args) => {
    const config = environment(...args)
    config.resolve.alias._ = path.join(process.cwd(), '..', 'node_modules');
    config.resolve.alias.webpack = path.join(process.cwd(), '..', 'node_modules', 'webpack');
    if (config.mode === 'production' && config.target === 'web') {
      config.plugins.push(
        new PurgeCSSPlugin({
          paths: glob.sync(`src/**/*`, { nodir: true }),
          content: ['./**/*.njs'],
          safelist: ['script', 'body', 'html', 'style'],
          defaultExtractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
        }),
      )
    }
    return config
  })
}

module.exports = applyAliases([server, client])
