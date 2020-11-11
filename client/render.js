import routeMatches from '../shared/routeMatches';
import {isFalse, isClass, isFunction, isRoutable, isText} from '../shared/nodes';
import router from './router';
import client from './client';
import {generateContext} from './context';
import generateKey from '../shared/generateKey';
import findParentInstance from './findParentInstance';
import environment from './environment';

export default function render(node, depth) {
  if(isRoutable(node)) {
    const routeDepth = depth.slice(0,-1).join('.');
    if(client.routes[routeDepth] !== undefined) {
      node.type = false;
      node.children = [];
    }
    const params = routeMatches(router.url, node.attributes.route);
    if(params) {
      client.routes[routeDepth] = true;
      node.attributes.params = params;
    } else {
      node.type = false;
      node.children = [];
    }
  }
  if(isFalse(node)) {
    return document.createComment("");
  }
  if(node != undefined && node.attributes != undefined && node.attributes.bind) {
    const instance = findParentInstance([0, ...depth]);
    const target = node.attributes.source || instance;
    if(node.type === 'textarea') {
      node.children = [target[node.attributes.bind]];
    } else {
      node.attributes.value = target[node.attributes.bind];
    }
    node.attributes.name = node.attributes.bind;
    let eventName = 'oninput';
    let valueName = 'value';
    if(node.attributes.type === 'checkbox' || node.attributes.type === 'radio') {
      eventName = 'onclick';
      valueName = 'checked';
    } else if(node.type !== 'input' && node.type !== 'textarea') {
      eventName = 'onchange';
    }
    const originalEvent = node.attributes[eventName];
    node.attributes[eventName] = ({event, value}) => {
      if(valueName == 'checked') {
        target[node.attributes.bind] = event.target[valueName];
      } else if(target[node.attributes.bind] === true || target[node.attributes.bind] === false) {
        target[node.attributes.bind] = event ? (event.target[valueName] == 'true') : value;
      } else if(typeof target[node.attributes.bind] === 'number') {
        target[node.attributes.bind] = parseFloat(event ? event.target[valueName] : value) || 0;
      } else {
        target[node.attributes.bind] = event ? event.target[valueName] : value;
      }
      client.update();
      if(originalEvent !== undefined) {
        setTimeout(() => {
          const context = generateContext({...instance.attributes, ...node.attributes, event, value});
          originalEvent(context);
        }, 0);
      }
    }
  }
  if(isFunction(node)) {
    const instance = findParentInstance([0, ...depth]);
    const context = generateContext({...instance.attributes, ...node.attributes});
    const root = node.type(context);
    node.children = [root];
    return render(node.children[0], [...depth, 0]);
  }
  if(isClass(node)) {
    const key = generateKey(node, [0, ...depth]);
    const instance = new node.type();
    instance.events = {};
    instance.attributes = node.attributes;
    client.instances[key] = instance;
    const context = generateContext(node.attributes);
    instance.prepare && instance.prepare(context);
    const root = instance.render(context);
    node.children = [root];
    client.instancesMountedQueue.push(instance);
    client.instancesRenewedQueue.push(instance);
    return render(node.children[0], [...depth, 0]);
  }
  if(isText(node)) {
    return document.createTextNode(node);
  }
  let element;
  let next = client.nextVirtualDom;
  let isSvg = false;
  for(const level of depth) {
    next = next.children[level];
    if(!next) break;
    if(next.type === 'svg') {
      isSvg = true;
      break;
    }
  }
  if(isSvg) {
    element = document.createElementNS("http://www.w3.org/2000/svg", node.type);
  } else {
    element = document.createElement(node.type);
  }
  if(node.type === 'a' && node.attributes.href && node.attributes.href.startsWith('/') && !node.attributes.target) {
    node.attributes.onclick = ({event}) => {
      event.preventDefault();
      router.url = node.attributes.href;
      environment.prerendered = false;
    };
  }
  for(let name in node.attributes) {
    if(name === 'html') {
      element.innerHTML = node.attributes[name];
      const links = element.querySelectorAll('a[href^="/"]:not([target])');
      for(const link of links) {
        link.onclick = (event) => {
          event.preventDefault();
          router.url = link.href;
          environment.prerendered = false;
        };
      }
    } else if(name.startsWith('on')) {
      const eventName = name.replace('on', '');
      const key = '0.' + depth.join('.') + '.' + eventName;
      const instance = findParentInstance([0, ...depth]);
      instance.events[key] = (event) => {
        if(node.attributes.default !== true) {
          event.preventDefault();
        }
        const context = generateContext({...instance.attributes, ...node.attributes, event});
        node.attributes[name](context);
      };
      element.addEventListener(eventName, instance.events[key]);
    } else if(typeof(node.attributes[name]) !== 'function' && typeof(node.attributes[name]) !== 'object') {
      if(name != 'value' && node.attributes[name] === true) {
        element.setAttribute(name, name);
      } else if(name == 'value' || (node.attributes[name] !== false && node.attributes[name] !== null && node.attributes[name] !== undefined)) {
        element.setAttribute(name, node.attributes[name]);
      }
    }
  }
  if(!node.attributes.html) {
    for(let i = 0; i < node.children.length; i++) {
      const dom = render(node.children[i], [...depth, i]);
      element.appendChild(dom);
    }
    if(node.type == 'select') {
      element.value = node.attributes.value;
    }
  }
  return element;
}