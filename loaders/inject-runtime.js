module.exports = function (source, map) {
  const injection = "import $runtime from 'nullstack/runtime';"
  this.callback(null, injection + source, map)
}