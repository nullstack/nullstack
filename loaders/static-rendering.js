const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function(source) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: [
      'classProperties', 'jsx'
    ]
  });
  const positions = [0];
  let shouldBeStatic = true;
  traverse(ast, {
    ClassDeclaration(path) {
      if(path.node.superClass.name === 'Nullstack') {
        for(const node of path.node.body.body) {
          if(node.type !== 'ClassMethod' || !node.key.name.startsWith('render')) {
            shouldBeStatic = false;
          } else {
            positions.push(node.start);
          }
        }
      } else {
        shouldBeStatic = false;
      }
    }
  });
  if(!shouldBeStatic) return source;
  positions.reverse();
  const sources = [];
  let last;
  for(const position of positions) {
    const code = source.slice(position, last);
    last = position;
    sources.unshift(code);
  } 
  return sources.join('static ');
}