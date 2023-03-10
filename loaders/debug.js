const list = [
    'Toast.njs',
    'IsomorphicImport.njs'
]

module.exports = function (source, map) {
    const shouldDebug = list.find((file) => this.resourcePath.endsWith(file))
    if (shouldDebug) {
        const { writeFileSync } = require('fs')
        const debugPath = this.resourcePath.split('.').join('.debug.')
        writeFileSync(debugPath, source)
    }
    this.callback(null, source, map)
}