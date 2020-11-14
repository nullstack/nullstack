import {isFalse, isClass, isFunction, isText} from '../shared/nodes';
import router from './router';
import client from './client';
import {generateContext} from './context';
import generateKey from '../shared/generateKey';
import findParentInstance from './findParentInstance';
import environment from './environment';
import prepareNodeRoute from './prepareNodeRoute';

export default function render(node, depth) {
  prepareNodeRoute(node, depth);
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
          originalEvent({...node.attributes, event, value});
        }, 0);
      }
    }
  }
  if(isFunction(node)) {
    const root = node.type(node.attributes);
    node.children = [root];
    return render(node.children[0], [...depth, 0]);
  }
  if(isClass(node)) {
    const key = generateKey(node, [0, ...depth]);
    const instance = new node.type();
    const memory = window.instances[key];
    if(memory) {
      for(const attribute in memory) {
        instance[attribute] = memory[attribute];
      }
      delete window.instances[key];
      client.instancesHydratedQueue.push(instance);
    }
    instance._events = {};
    instance._attributes = node.attributes;
    client.instances[key] = instance;
    const context = generateContext(node.attributes);
    instance._context = context;
    if(!memory) {
      client.instancesMountedQueue.push(instance);
      instance.prepare && instance.prepare();
    }
    const root = instance.render();
    node.children = [root];
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
      instance._events[key] = (event) => {
        if(node.attributes.default !== true) {
          event.preventDefault();
        }
        node.attributes[name]({...node.attributes, event});
      };
      element.addEventListener(eventName, instance._events[key]);
    } else if(typeof(node.attributes[name]) !== 'function' && typeof(node.attributes[name]) !== 'object') {
      if(name != 'value' && node.attributes[name] === true) {
        element.setAttribute(name, '');
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