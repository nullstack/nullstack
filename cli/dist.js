const concurrently = require('concurrently');
const fs = require('fs');

module.exports = function() {
  concurrently([{
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.client.prod.js',
    name: 'client'
  }, {
    command: 'cd ./node_modules/webpack/bin && node webpack.js --config ../../nullstack/webpack.server.prod.js',
    name: 'server'
  }]);
}
