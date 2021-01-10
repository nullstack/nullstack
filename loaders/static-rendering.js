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
  let className;
  traverse(ast, {
    ClassDeclaration(path) {
      className = path.node.id.name;
      if(path.node.superClass.name === 'Nullstack') {
        for(const node of path.node.body.body) {
          if(node.type !== 'ClassMethod' || !node.key.name.startsWith('render')) {
            shouldBeStatic = false;
          } else {
            if(node.key.name === 'render') {
              positions.push(node.start);
            } else {
              if(node.type === 'ClassMethod' && (!node.params || !node.params.length)) {
                positions.push(node.start);
              } else {
                shouldBeStatic = false;
              }
            }
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

  expressions = [0];
  source = sources.join('static ');
  const sast = parse(source, {
    sourceType: 'module',
    plugins: [
      'classProperties', 'jsx'
    ]
  });
  traverse(sast, {
    ThisExpression(path) {
      expressions.push(path.node.start);
    }
  });
  expressions.reverse();
  const esources = [];
  let elast;
  for(const position of expressions) {
    let code = source.slice(position, elast);
    if(code.startsWith('this')) {
      code = className + code.slice(4);
    }
    elast = position;
    esources.unshift(code);
  }
  return esources.join('');
}