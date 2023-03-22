module.exports = function (source, map) {
  if (this.resourcePath.includes('Application.njs')) {
    require('fs').writeFileSync('debug.njs', source)
  }
  this.callback(null, source, map)
}