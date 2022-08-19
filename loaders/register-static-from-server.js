const crypto = require('crypto');
const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function (source) {
  let hasClass = false;
  const legacyHash = crypto.createHash('md5').update(source).digest("hex");
  const id = this.resourcePath.replace(this.rootContext, '')
  const hash = crypto.createHash('md5').update(id).digest("hex");
  let klassName;
  let klassEnd;
  const methodNames = [];
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx']
  });
  traverse(ast, {
    ClassDeclaration(path) {
      hasClass = true;
      klassEnd = path.node.end - 1;
      klassName = path.node.id.name;
    },
    ClassMethod(path) {
      if (path.node.static && path.node.async && !path.node.key.name.startsWith('_')) {
        methodNames.push(path.node.key.name);
      }
    }
  });
  if (!hasClass) return source;
  let output = source.substring(0, klassEnd);
  output += source.substring(klassEnd);
  for (const methodName of methodNames) {
    output += `\nNullstack.registry["${hash}.${methodName}"] = ${klassName}.${methodName};`
    output += `\nNullstack.registry["${legacyHash}.${methodName}"] = ${klassName}.${methodName};`
  }
  output += `\nNullstack.registry["${hash}"] = ${klassName};`
  output += `\nNullstack.registry["${legacyHash}"] = ${klassName};`
  output += `\n${klassName}.hash = "${hash}";`
  output += `\n${klassName}.bindStaticFunctions(${klassName});`
  return output;
}