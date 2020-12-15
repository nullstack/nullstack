import {isBindable, isClass, isFunction, isRoutable, isStatic} from '../shared/nodes';
import routeMatches from '../shared/routeMatches';
import generateKey from '../shared/generateKey';
import parameterizableNode from '../shared/parameterizableNode';

export default async function render(node, depth, scope) {
  if(node === false || (node !== undefined && node.type === false)) {
    return "<!-- -->";
  }
  if(isBindable(node)) {
    const target = node.attributes.source;
    if(node.type === 'textarea') {
      node.children = [target[node.attributes.bind]];
    } else if(node.type === 'input' && node.attributes.type === 'checkbox') {
      node.attributes.checked = target[node.attributes.bind];
    } else {
      node.attributes.value = target[node.attributes.bind];
    }
    node.attributes.name = node.attributes.bind;
  }
  if(isRoutable(node)) {
    const routeDepth = depth.slice(0,-1).join('.');
    if(scope.routes[routeDepth] !== undefined) {
      node.type = false;
      node.children = [];
      return await render(node, depth, scope);
    }
    const url = scope.request.originalUrl;
    const params = routeMatches(url, node.attributes.route);
    if(params) {
      scope.routes[routeDepth] = true;
      for(const key in params) {
        scope.context.params[key] = params[key];
      }
    } else {
      node.type = false;
      node.children = [];
      return await render(node, depth, scope);
    }
  }
  if(node === undefined || node.type === undefined) {
    return node + "<!--#-->";
  } else if (isStatic(node)) {
    const root = (node.type.render || node.type).call(node.type, {...scope.context, ...node.attributes});
    node.children = [root];
    return await render(node.children[0], [...depth, 0], scope);
  } else if (isFunction(node)) {
    const root = node.type(node.attributes);
    node.children = [root];
    return await render(node.children[0], [...depth, 0], scope);
  } else if (isClass(node)) {
    const key = node.attributes.key || generateKey(depth);
    const instance = new node.type(scope);
    instance.attributes = node.attributes;
    scope.instances[key] = instance;
    instance._attributes = node.attributes;
    instance._scope = scope;
    instance.prepare && instance.prepare();
    instance.initiate && await instance.initiate();
    const root = instance.render();
    node.children = [root];
    node.type = node.type.name;
    return await render(node.children[0], [...depth, 0], scope);
  } else {
    parameterizableNode(node, scope.context.router, scope.context.params);
    let element = `<${node.type}`;
    for(let name in node.attributes) {
      if(!name.startsWith('on') && name !== 'html' && typeof(node.attributes[name]) != 'object') {
        if(name != 'value' && node.attributes[name] === true) {
          element += ` ${name}`;
        } else if(name == 'value' || (node.attributes[name] !== false && node.attributes[name] !== null && node.attributes[name] !== undefined)) {
          element += ` ${name}="${node.attributes[name]}"`;
        }
      }
    }
    const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'menuitem'].includes(node.type);
    if(selfClosing && node.children.length === 0) {
      element += '/>';
    } else {
      element += '>';
      if(node.attributes.html) {
        const source = node.attributes.html;
        if(node.type === 'head') {
          scope.head += source;
        } else {
          element += source;
        }
      } else if(node.type === 'textarea') {
        element += node.children[0];
      } else {
        for(let i = 0; i < node.children.length; i++) {
          const source = await render(node.children[i], [...depth, i], scope);
          if(node.type === 'head') {
            scope.head += source;
          } else {
            element += source;
          }
        }
      }
      element += `</${node.type}>`;
    }
    return node.type === 'head' ? '<!-- -->' : element;
  }
}