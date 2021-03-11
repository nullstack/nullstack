import routeMatches from '../shared/routeMatches';

function erase(node) {
  node.type = false;
  delete node.attributes;
  delete node.children;
}

function match(node) {
  return (
    node && 
    node.attributes !== undefined &&
    node.attributes.route !== undefined
  )
}

function load({scope}) {
  scope.routes = {};
  if(!scope.oldSegments) {
    scope.oldSegments = {};
    scope.newSegments = {};
  } else {
    scope.oldSegments = scope.newSegments;
    scope.newSegments = {};
  }
}

function transform({node, depth, scope}) {
  if(!match(node)) return;
  const routeDepth = depth.slice(0, -1).join('.');
  if(scope.routes[routeDepth] !== undefined) {
    erase(node);
  } else {
    const url = scope.context.router.url;
    const params = routeMatches(url, node.attributes.route);
    if(params) {
      scope.routes[routeDepth] = true;
      scope.newSegments[routeDepth] = params;
      Object.assign(scope.segments, params);
    } else {
      erase(node);
    }
  }
}

export default { load, transform, client: true, server: true }