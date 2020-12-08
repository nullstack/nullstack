const crypto = require('crypto');
const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function(source) {
  const hash = crypto.createHash('md5').update(source).digest("hex");
  let hashPosition;
  let shouldHash = false;
  const injections = {};
  const positions = [];
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx']
  });
  traverse(ast, {
    ClassBody(path) {
      const start = path.node.body[0].start;
      hashPosition = start;
      positions.push(start);
    },
    ClassMethod(path) {
      if(path.node.static && path.node.async) {
        injections[path.node.start] = {end: path.node.end, name: path.node.key.name};
        if(!positions.includes(path.node.start)) {
          positions.push(path.node.start);
        }
        if(path.node.key.name !== 'start') {
          shouldHash = true;
        }
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
    if (position && injection) {
      const location = injection.end - position;
      if(injection.name === 'start') {
        code = code.substring(location).trimStart();
      } else {
        code = `static ${injection.name} = true;` + code.substring(location);
      }
      outputs.push(code);
    } else {
      outputs.push(code);
    }
    console.log({injections});
    if(position === hashPosition && shouldHash) {
      outputs.push(`static hash = '${hash}';\n\n  `);
    } 
  }
  return outputs.reverse().join('');
}