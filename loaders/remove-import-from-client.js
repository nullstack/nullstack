const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function(source) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx']
  });
  const imports = {};
  function findImports(path) {
    if(path.node.local.name !== 'Nullstack') {
      const parent = path.findParent((path) => path.isImportDeclaration());
      const start = parent.node.loc.start.line;
      const end = parent.node.loc.end.line;
      const lines = new Array(end - start + 1).fill().map((d, i) => i + start);
      imports[path.node.local.name] = lines;
    }
  }
  function findIdentifiers(path) {
    if(path.parent.type !== 'ImportDefaultSpecifier' && path.parent.type !== 'ImportSpecifier') {
      delete imports[path.node.name];
    }
  }
  traverse(ast, {
    ImportSpecifier: findImports,
    ImportDefaultSpecifier: findImports
  });
  traverse(ast, {
    Identifier: findIdentifiers,
    JSXIdentifier: findIdentifiers
  });
  const lines = Object.keys(imports).map((key) => imports[key]).flat();
  return source.split(`\n`).filter((line, index) => !lines.includes(index + 1)).join(`\n`);
}