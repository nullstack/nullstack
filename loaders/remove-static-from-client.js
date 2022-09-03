const crypto = require('crypto');
const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function removeStaticFromClient(source) {
  const id = this.resourcePath.replace(this.rootContext, '')
  const hash = crypto.createHash('md5').update(id).digest("hex");
  let hashPosition;
  let klassName;
  const injections = {};
  const positions = [];
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx']
  });
  traverse(ast, {
    ClassDeclaration(path) {
      klassName = path.node.id.name;
    },
    ClassBody(path) {
      const start = path.node.body[0].start;
      hashPosition = start;
      positions.push(start);
    },
    ClassMethod(path) {
      if (path.node.static && path.node.async) {
        injections[path.node.start] = { end: path.node.end, name: path.node.key.name };
        if (!positions.includes(path.node.start)) {
          positions.push(path.node.start);
        }
      }
    }
  });
  positions.reverse();
  positions.push(0);
  let outputs = [];
  let last;
  for (const position of positions) {
    let code = source.slice(position, last);
    last = position;
    const injection = injections[position];
    if (position && injection) {
      const location = injection.end - position;
      if (injection.name.startsWith('_')) {
        code = code.substring(location).trimStart();
      } else {
        code = `static ${injection.name} = Nullstack.invoke('${injection.name}', '${hash}');` + code.substring(location);
      }
      outputs.push(code);
    } else {
      outputs.push(code);
    }
    if (position === hashPosition) {
      outputs.push(`static hash = '${hash}';\n\n  `);
    }
  }
  let newSource = outputs.reverse().join('')
  if (klassName) {
    newSource += `\nif (module.hot) { module.hot.accept(); Nullstack.updateInstancesPrototypes(${klassName}.hash, ${klassName}) }`;
  }
  return newSource
}