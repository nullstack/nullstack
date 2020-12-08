const crypto = require('crypto');
const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function(source) {
  console.log('======================')
  console.log(source);
  const hash = crypto.createHash('md5').update(source).digest("hex");
  const injections = {};
  const positions = [];
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx']
  });
  traverse(ast, {
    ClassBody(path) {
      injections[path.node.start] = 'hash';
      positions.push(path.node.start);
    },
    ClassMethod(path) {
      if(path.node.static) {
        injections[path.node.start] = {end: path.node.end, name: path.node.key.name};
        positions.push(path.node.start);
      }
    }
  });
  positions.reverse();
  positions.push(0);
  let outputs = [];
  let last;
  for(const position of positions) {
    let code = source.slice(position, last);
    last = position;
    const injection = injections[position];
    if(injection == 'hash') {
      outputs.push(`static hash = '${hash}';\n\n  `);
    } else if (injection) {
      const location = injection.end - position;
      code = `static ${injection.name} = true;` + code.substring(location);
    }
    outputs.push(code);
  }
  return outputs.reverse().join('');
}