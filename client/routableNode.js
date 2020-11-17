import routeMatches from '../shared/routeMatches';
import {isRoutable} from '../shared/nodes';
import router from './router';
import client from './client';
import segments from './segments';

export default function routableNode(node, depth) {
  if(isRoutable(node)) {
    const routeDepth = depth.slice(0,-1).join('.');
    if(client.routes[routeDepth] !== undefined) {
      node.type = false;
      node.children = [];
    } else {
      const params = routeMatches(router.url, node.attributes.route);
      if(params !== false) {
        client.routes[routeDepth] = true;
        for(const key in params) {
          segments[key] = params[key];
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
