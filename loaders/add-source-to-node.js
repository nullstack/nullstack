const parse = require('@babel/parser').parse
const traverse = require('@babel/traverse').default

module.exports = function (source) {
  this.cacheable && this.cacheable()
  const uniquePositions = new Set()
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript'],
  })
  traverse(ast, {
    JSXIdentifier(path) {
      if (path.parent.type === 'JSXAttribute') {
        if (path.node.name.startsWith('on')) {
          const element = path.findParent((p) => p.type === 'JSXOpeningElement' && p.node.attributes)
          const hasSource = element.node.attributes.find((a) => {
            return a.type === 'JSXAttribute' && a.name.name === 'source'
          })
          if (!hasSource) {
            const start = element.node.attributes[0].start
            uniquePositions.add(start)
          }
        }
      }
    },
  })
  if (uniquePositions.size === 0) return source
  const positions = [...uniquePositions]
  positions.reverse()
  positions.push(0)
  const outputs = []
  let last
  for (const position of positions) {
    const code = source.slice(position, last)
    last = position
    outputs.push(code)
    if (position) {
      outputs.push(`source={this} `)
    }
  }

  return outputs.reverse().join('')
}
