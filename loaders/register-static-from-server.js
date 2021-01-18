const crypto = require('crypto');
const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function(source) {
  const hash = crypto.createHash('md5').update(source).digest("hex");
  let klassName;
  const methodNames = [];
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx']
  });
  traverse(ast, {
    ClassDeclaration(path) {
      klassName = path.node.id.name;
    },
    ClassMethod(path) {
      if(path.node.static && path.node.async && path.node.key.name.split(/[A-Z]/)[0] !== 'start') {
        methodNames.push(path.node.key.name);
      }
    }
  });
  for(const methodName of methodNames) {
    source += `\nNullstack.registry["${hash}.${methodName}"] = ${klassName}.${methodName}.bind(${klassName});`
  }
  return source;
}