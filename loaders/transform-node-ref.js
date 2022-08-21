const parse = require('@babel/parser').parse;
const traverse = require("@babel/traverse").default;

const attributes = ['ref', 'bind']

module.exports = function removeStaticFromClient(source) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript']
  });
  const refs = []
  traverse(ast, {
    JSXAttribute(path) {
      const attribute = path.node.name.name
      if (attributes.includes(attribute)) {
        const expression = path.node.value.expression
        if (expression.type !== 'Identifier') {
          const object = expression.object
          const property = expression.property
          const refObject = source.slice(object.start, object.end)
          let refProperty = source.slice(property.start, property.end)
          if (property.type === 'Identifier' && !expression.computed) {
            refProperty = `'${refProperty}'`
          }
          replacement = `${attribute}={{object: ${refObject}, property: ${refProperty}}}`
          refs.push({
            start: path.node.start,
            end: path.node.end,
            replacement
          })
        }
      }
    }
  });
  if (refs.length === 0) return source
  const sources = []
  for (let i = 0; i <= refs.length; i++) {
    const prev = refs[i - 1]
    const current = refs[i]
    const start = prev ? prev.end : 0
    const end = current ? current.start : undefined
    const before = source.slice(start, end)
    sources.push(before)
    if (current) {
      sources.push(current.replacement)
    }
  }
  return sources.join('')
}