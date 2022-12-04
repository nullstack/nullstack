const parse = require('@babel/parser').parse
const traverse = require('@babel/traverse').default

module.exports = function (source) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx'],
  })
  let shouldImport = true
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'nullstack') {
        shouldImport = false
      }
    },
  })
  if (shouldImport) {
    source = `import Nullstack from 'nullstack'\n${source}`
  }
  return source
}
