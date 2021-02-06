const crypto = require('crypto');
const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function(source) {
  const hash = crypto.createHash('md5').update(source).digest("hex");
  let klassName;
  let klassEnd;
  const methodNames = [];
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx']
  });
  traverse(ast, {
    ClassDeclaration(path) {
      klassEnd = path.node.end - 1;
      klassName = path.node.id.name;
    },
    ClassMethod(path) {
      if(path.node.static && path.node.async && path.node.key.name.split(/[A-Z]/)[0] !== 'start') {
        methodNames.push(path.node.key.name);
      }
    }
  });
  let output = source.substring(0, klassEnd);
  for(const methodName of methodNames) {
    output += `${methodName} = Nullstack.invoke('${methodName}');\n`
  }
  output += source.substring(klassEnd);
  for(const methodName of methodNames) {
    output += `\nNullstack.registry["${hash}.${methodName}"] = ${klassName}.${methodName};`
  }
  output += `\nNullstack.registry["${hash}"] = ${klassName};`
  return output;
}