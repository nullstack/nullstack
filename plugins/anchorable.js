import noop from '../shared/noop'

function match(node) {
  return (
    node &&
    node.type === 'a' &&
    node.attributes.href &&
    node.attributes.href.startsWith('/') &&
    !node.attributes.target
  )
}

function transform({ node }) {
  if (!match(node)) return
  node.attributes.onclick ??= noop
}

export default { transform, client: true }
