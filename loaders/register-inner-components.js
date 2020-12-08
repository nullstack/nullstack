const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

module.exports = function(source) {
  const injections = {};
  const positions = [];
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx']
  });
  traverse(ast, {
    ClassMethod(path) {
      if(path.node.key.name.startsWith('render')) {
        traverse(path.node, {
          JSXIdentifier(subpath) {
            if(/^[A-Z]/.test(subpath.node.name)) {
              if(!path.scope.hasBinding(subpath.node.name)) {
                const start = path.node.body.body[0].start;
                if(!positions.includes(start)) {
                  positions.push(start);
                  injections[start] = subpath.node.name;
                }
              }
            }
          },
        }, path.scope, path);
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
    outputs.push(code);
      if(injection) {
        outputs.push(`const ${injection} = this.render${injection};\n    `)
      }
  }
  return outputs.reverse().join('');
}