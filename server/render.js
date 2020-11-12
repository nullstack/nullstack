import {isClass, isFunction, isRoutable} from '../shared/nodes';
import routeMatches from '../shared/routeMatches';
import generateKey from '../shared/generateKey';

export default async function render(node, depth, scope) {
  if(node.type === 'Fragment') {
    let element = '';
    for(let i = 0; i < node.children.length; i++) {
      element += await render(node.children[i], [...depth, i], scope);
    }
    return element;
  }
  if(node === false || (node !== undefined && node.type === false)) {
    return "<!-- -->";
  }
  if(node !== undefined && node.attributes != undefined && node.attributes.bind) {
    const instance = scope.findParentInstance(depth);
    const target = node.attributes.source || instance;
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
  } else if (isFunction(node)) {
    const root = node.type(node.attributes);
    node.children = [root];
    return await render(node.children[0], [...depth, 0], scope);
  } else if (isClass(node)) {
    const key = generateKey(node, depth);
    const instance = new node.type(scope);
    instance.attributes = node.attributes;
    scope.instances[key] = instance;
    const context = scope.generateContext(node.attributes);
    instance._context = context;
    instance.prepare && instance.prepare();
    instance.initiate && await instance.initiate();
    const root = instance.render();
    node.children = [root];
    node.type = node.type.name;
    return await render(node.children[0], [...depth, 0], scope);
  } else {
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
        element += node.attributes.html;
      } else if(node.type === 'textarea') {
        element += node.children[0];
      } else {
        for(let i = 0; i < node.children.length; i++) {
          element += await render(node.children[i], [...depth, i], scope);
        }
      }
      element += `</${node.type}>`;
    }
    return element;
  }
}