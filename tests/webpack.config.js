const [server, client] = require('nullstack/webpack.config');

const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');

function customClient(...args) {
  const config = client(...args);
  if (config.mode === 'production') {
    config.plugins.push(new PurgecssPlugin({
      paths: glob.sync(`src/**/*`, { nodir: true }),
      content: ['./**/*.njs'],
      safelist: ['script', 'body', 'html', 'style'],
      defaultExtractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
    }));
  }

  return config;
}

module.exports = [server, customClient]