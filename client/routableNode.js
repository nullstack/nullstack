import routeMatches from '../shared/routeMatches';
import {isRoutable} from '../shared/nodes';
import router from './router';
import client from './client';
import context from './context';

export default function routableNode(node, depth) {
  if(isRoutable(node)) {
    const routeDepth = depth.slice(0,-1).join('.');
    if(client.routes[routeDepth] !== undefined) {
      node.type = false;
      node.children = [];
    } else {
      const params = routeMatches(router.url, node.attributes.route);
      if(params !== false) {
        node._segments = node.attributes.route.split('/').filter((segment) => {
          return segment[0] == ':';
        }).map((segment) => {
          return segment.slice(1);
        });
        router._addSegments(node._segments);
        client.routes[routeDepth] = true;
        for(const key in params) {
          context.params[key] = params[key];
        }
        node._params = params;
      } else {
        node.type = false;
        node.children = [];
      }
    }
    delete node.attributes.route;
  }
}
