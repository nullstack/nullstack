import routeMatches from '../shared/routeMatches';
import {isFalse, isClass, isFunction, isRoutable, isText} from '../shared/nodes';
import router from './router';
import client from './client';
import render from './render';
import context, {generateContext} from './context';
import generateKey from '../shared/generateKey';
import findParentInstance from './findParentInstance';
import environment from './environment';

export default function rerender(parent, depth, vdepth) {
  if(!client.hydrated) {
    for(const element of parent.childNodes) {
      if(element.tagName && element.tagName.toLowerCase() == 'textarea' && element.childNodes.length == 0) {
        element.appendChild(document.createTextNode(''));
      }
      if(element.COMMENT_NODE === 8 && element.textContent === '#') {
        parent.removeChild(element);
      }
    }
  }
  const index = depth[depth.length - 1];
  const selector = parent.childNodes[index];
  let current = client.virtualDom;
  let next = client.nextVirtualDom;
  for(const level of vdepth) {
    current = current.children[level];
    next = next.children[level];
  }
  if(isFalse(current) && isFalse(next)) {
    return;
  }
  if((isFalse(current) || isFalse(next)) && current != next) {
    const nextSelector = render(next, vdepth);
    return parent.replaceChild(nextSelector, selector);
  }
  if(next !== undefined && next.attributes !== undefined && next.attributes.bind) {
    const instance = findParentInstance([0, ...vdepth]);
    const target = next.attributes.source || instance;
    if(next.type === 'textarea') {
      next.children = [target[next.attributes.bind]];
    } else if(next.type === 'input' && next.attributes.type === 'checkbox') {
      next.attributes.checked = target[next.attributes.bind];
    } else {
      next.attributes.value = target[next.attributes.bind];
    }
    next.attributes.name = next.attributes.bind;
    let eventName = 'oninput';
    let valueName = 'value';
    if(next.attributes.type === 'checkbox' || next.attributes.type === 'radio') {
      eventName = 'onclick';
      valueName = 'checked';
    } else if(next.type !== 'input' && next.type !== 'textarea') {
      eventName = 'onchange';
    }
    const originalEvent = next.attributes[eventName];
    next.attributes[eventName] = ({event, value}) => {
      if(valueName == 'checked') {
        target[next.attributes.bind] = event.target[valueName];
      } else if(target[next.attributes.bind] === true || target[next.attributes.bind] === false) {
        target[next.attributes.bind] = event ? (event.target[valueName] == 'true') : value;
      } else if(typeof target[next.attributes.bind] === 'number') {
        target[next.attributes.bind] = parseFloat(event ? event.target[valueName] : value) || 0;
      } else {
        target[next.attributes.bind] = event ? event.target[valueName] : value;
      }
      client.update();
      if(originalEvent !== undefined) {
        setTimeout(() => {
          originalEvent({...next.attributes, event, value});
        }, 0);
      }
    }
  }
  if(isFunction(next)) {
    const root = next.type(next.attributes);
    next.children = [root];
    return rerender(parent, depth, [...vdepth, 0]);
  }
  if(isClass(current) && current.type === next.type) {
    const key = generateKey(next, [0, ...vdepth]);
    let instance = null;
    if(!router._changed) {
      instance = client.instances[key];
    } else if(router._changed) {
      let shouldReinitiate = false;
      if(next._segments) {
        for(const segment of next._segments) {
          if(current._params[segment] !== next._params[segment]) {
            shouldReinitiate = true;
          }
        }
      }
      if(!shouldReinitiate) {
        instance = client.instances[key];
      }
    }
    const context = generateContext(next.attributes);
    if(instance) {
      instance._context = context;
      instance.update && instance.update();
    } else {
      instance = new next.type();
      const memory = window.instances[key];
      if(memory) {
        for(const attribute in memory) {
          instance[attribute] = memory[attribute];
        }
        delete window.instances[key];
        client.instancesHydratedQueue.push(instance);
      }
      instance._context = context;
      instance._events = {};
      client.instances[key] = instance;
      if(!memory) {
        client.instancesMountedQueue.push(instance);
        instance.prepare && instance.prepare();
      }
    }
    instance._attributes = next.attributes;
    client.instancesRenewedQueue.push(instance);
    const root = instance.render();
    next.children = [root];
    const limit = Math.max(current.children.length, next.children.length);
    for(let i = 0; i < limit; i++) {
      rerender(parent, depth, [...vdepth, i]);
    }
  } else if (current.type !== next.type) {
    const nextSelector = render(next, vdepth);
    parent.replaceChild(nextSelector, selector);
  } else if (isText(current) && isText(next)) {
    if(current != next) {
      return selector.nodeValue = next;
    }
  } else if (current.type === next.type) {
    if(next.type === 'a' && next.attributes.href && next.attributes.href.startsWith('/') && !next.attributes.target) {
      next.attributes.onclick = ({event}) => {
        event.preventDefault();
        router.url = next.attributes.href;
        environment.prerendered = false;
      };
    }
    const attributeNames = Object.keys({...current.attributes, ...next.attributes});
    for(const name of attributeNames) {
      if(name === 'html') {
        if(next.attributes[name] !== current.attributes[name]) {
          selector.innerHTML = next.attributes[name];
        }
        const links = selector.querySelectorAll('a[href^="/"]:not([target])');
        for(const link of links) {
          link.onclick = (event) => {
            event.preventDefault();
            router.url = link.href;
            environment.prerendered = false;
          };
        }
      } else if(name === 'checked') {
        if(next.attributes[name] !== selector.value) {
          selector.checked = next.attributes[name];
        }
      } else if(name === 'value') {
        if(next.attributes[name] !== selector.value) {
          selector.value = next.attributes[name];
        }
      } else if(name.startsWith('on')) {
        const eventName = name.replace('on', '');
        const key = '0.' + vdepth.join('.') + '.' + eventName;
        const instance = findParentInstance([0, ...vdepth]);
        selector.removeEventListener(eventName, instance._events[key]);
        if(next.attributes[name]) {
          instance._events[key] = (event) => {
            if(next.attributes.default !== true) {
              event.preventDefault();
            }
            next.attributes[name]({...next.attributes, event});
          };
          selector.addEventListener(eventName, instance._events[key]);
        } else {
          delete instance._events[key];
        }
      } else if(typeof(next.attributes[name]) !== 'function' && typeof(next.attributes[name]) !== 'object') {
        if(current.attributes[name] === undefined && next.attributes[name] !== undefined) {
          selector.setAttribute(name, next.attributes[name]);
        } else if(current.attributes[name] !== undefined && next.attributes[name] === undefined) {
          selector.removeAttribute(name);
        } else if(current.attributes[name] !== next.attributes[name]) {
          if(name != 'value' && next.attributes[name] === false || next.attributes[name] === null || next.attributes[name] === undefined) {
            selector.removeAttribute(name);
          } else if(name != 'value' && next.attributes[name] === true) {
            selector.setAttribute(name, '');
          } else {
            selector.setAttribute(name, next.attributes[name]);
          }
        }
      }
    }
    if(next.attributes.html) return;
    const limit = Math.max(current.children.length, next.children.length);
    const routeDepth = depth.join('.');
    for(const child of next.children) {
      if(isRoutable(child)) {
        child._segments = child.attributes.route.split('/').filter((segment) => {
          return segment[0] == ':';
        }).map((segment) => {
          return segment.slice(1);
        });
        router._addSegments(child._segments);
        if(client.routes[routeDepth] !== undefined) {
          child.type = false;
          child.children = [];
        } else {
          const params = routeMatches(router.url, child.attributes.route);
          if(params) {
            client.routes[routeDepth] = true;
            for(const key in params) {
              context.params[key] = params[key];
            }
            child._params = params;
          } else {
            child.type = false;
            child.children = [];
          }
        }
        delete child.attributes.route;
      }
    }
    if(next.children.length > current.children.length) {
      for(let i = 0; i < current.children.length; i++) {
        rerender(selector, [...depth, i], [...vdepth, i]);
      }
      for(let i = current.children.length; i < next.children.length; i++) {
        const nextSelector = render(next.children[i], [...vdepth, i]);
        selector.appendChild(nextSelector);
      }
    } else if(current.children.length > next.children.length) {
      for(let i = 0; i < next.children.length; i++) {
        rerender(selector, [...depth, i], [...vdepth, i]);
      }
      for(let i = current.children.length - 1; i >= next.children.length; i--) {
        selector.removeChild(selector.childNodes[i]);          
      }
    } else {
      for(let i = limit - 1; i > -1; i--) {
        rerender(selector, [...depth, i], [...vdepth, i]);
      }
    }
    if(next.type == 'textarea') {
      selector.value = next.children.join("");
    }
    if(next.type == 'select') {
      selector.value = next.attributes.value;
    }
  }
}