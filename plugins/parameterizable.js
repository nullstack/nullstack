import serializeParam from '../shared/serializeParam'
import serializeSearch from '../shared/serializeSearch'

function match(node) {
  return node && node.attributes && (node.attributes.params || node.attributes.path)
}

function transform({ node, router, params }) {
  if (!match(node)) return
  let serializedParams
  if (node.attributes.params) {
    serializedParams = {}
    for (const key in node.attributes.params) {
      serializedParams[key] = serializeParam(node.attributes.params[key])
    }
  } else {
    serializedParams = params
  }
  const search = serializeSearch(serializedParams)
  const path = node.attributes.path || router.path
  node.attributes.href = path + (search ? '?' : '') + search
  delete node.attributes.path
  delete node.attributes.params
}

export default { transform, client: true, server: true }
