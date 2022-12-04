const parse = require('@babel/parser').parse
const traverse = require('@babel/traverse').default

const parentTypes = ['ImportDefaultSpecifier', 'ImportSpecifier', 'ImportNamespaceSpecifier']

module.exports = function (source) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx'],
  })
  const imports = {}
  function findImports(path) {
    if (path.node.local.name !== 'Nullstack') {
      const parent = path.findParent((p) => p.isImportDeclaration())
      const start = parent.node.loc.start.line
      const end = parent.node.loc.end.line
      const lines = new Array(end - start + 1).fill().map((d, i) => i + start)
      const key = lines.join('.')
      imports[path.node.local.name] = { lines, key }
    }
  }
  function findIdentifiers(path) {
    if (parentTypes.indexOf(path.parent.type) === -1) {
      const target = imports[path.node.name]
      if (target) {
        for (const name in imports) {
          if (imports[name].key === target.key) {
            if (path.parent.type !== 'MemberExpression' || path.parent.object?.type !== 'ThisExpression') {
              delete imports[name]
            }
          }
        }
      }
    }
  }
  traverse(ast, {
    ImportSpecifier: findImports,
    ImportDefaultSpecifier: findImports,
    ImportNamespaceSpecifier: findImports,
  })
  traverse(ast, {
    Identifier: findIdentifiers,
    JSXIdentifier: findIdentifiers,
  })
  const lines = Object.keys(imports)
    .map((name) => imports[name].lines)
    .flat()
  return source
    .split(`\n`)
    .filter((line, index) => !lines.includes(index + 1))
    .join(`\n`)
}
