module.exports = function (source, map) {
  console.info(`  [${process.env.__NULLSTACK_TARGET}] ${this.resourcePath}`)
  this.callback(null, source, map)
}