module.exports = function (source, map) {
  if (this.resourcePath.includes('ServerFunctions.njs')) {
    require('fs').writeFileSync('debug.njs', source)
  }
  this.callback(null, source, map)
}