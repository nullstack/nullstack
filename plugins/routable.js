import routeMatches from '../shared/routeMatches';

export default class Routable {

  static client = true;
  static server = true;

  constructor({scope}) {
    scope.routes = {};
    if(!scope.oldSegments) {
      scope.oldSegments = {};
      scope.newSegments = {};
    } else {
      scope.oldSegments = scope.newSegments;
      scope.newSegments = {};
    }
  }

  match({node}) {
    return (
      node && 
      node.attributes !== undefined &&
      node.attributes.route !== undefined
    )
  }

  transform({node, depth, scope}) {
    const routeDepth = depth.slice(0, -1).join('.');
    if(scope.routes[routeDepth] !== undefined) {
      this._erase(node);
    } else {
      const url = scope.context.router.url;
      const params = routeMatches(url, node.attributes.route);
      if(params) {
        scope.routes[routeDepth] = true;
        scope.newSegments[routeDepth] = params;
        Object.assign(scope.segments, params);
      } else {
        this._erase(node);
      }
    }
  }

  _erase(node) {
    node.type = false;
    delete node.attributes;
    delete node.children;
  }

}