import routeMatches from '../shared/routeMatches'

function erase(node) {
  node.type = false
  delete node.attributes
  delete node.children
}

function match(node) {
  return node && node.attributes !== undefined && node.attributes.route !== undefined
}

function load({ router }) {
  router._routes = {}
}

function transform({ node, depth, router }) {
  if (!match(node)) return
  const routeDepth = depth.slice(0, depth.lastIndexOf('-'))
  if (router._routes[routeDepth] !== undefined) {
    erase(node)
  } else {
    const params = routeMatches(router.url, node.attributes.route)
    if (params) {
      router._routes[routeDepth] = true
      Object.assign(router._segments, params)
    } else {
      erase(node)
    }
  }
}

export default { load, transform, client: true, server: true }
