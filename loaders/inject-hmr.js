const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function (source) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx']
  });
  let klassName
  let klassPath
  traverse(ast, {
    MemberExpression(path) {
      if (path.node.property.name === 'start' && path.node.object?.name === 'Nullstack') {
        klassName = path.parent.arguments[0].name
      }
    }
  });
  if (!klassName) return source
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.specifiers[0].local.name === klassName) {
        klassPath = path.node.source.extra.rawValue
      }
    }
  });

  return source + `
    if (module.hot) {
      module.hot.accept('${klassPath}', () => {
        Nullstack.hotReload(${klassName})
      })
    }
  `
}