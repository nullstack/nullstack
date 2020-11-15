import {isFalse, isClass, isFunction, isText} from '../shared/nodes';
import client from './client';
import params from './params';
import router from './router';
import render from './render';
import {generateContext} from './context';
import generateKey from '../shared/generateKey';
import findParentInstance from './findParentInstance';
import routableNode from './routableNode';
import bindableNode from './bindableNode';
import {anchorableNode, anchorableElement} from './anchorableNode';
import parameterizableNode from '../shared/parameterizableNode';

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
  bindableNode(next, [0, ...vdepth])
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
      if(next._params) {
        for(const segment in next._params) {
          if(current._params && current._params[segment] !== next._params[segment]) {
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
    parameterizableNode(next, router, params);
    anchorableNode(next);
    const attributeNames = Object.keys({...current.attributes, ...next.attributes});
    for(const name of attributeNames) {
      if(name === 'html') {
        if(next.attributes[name] !== current.attributes[name]) {
          selector.innerHTML = next.attributes[name];
          anchorableElement(selector);
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
    for(const child of next.children) {
      routableNode(child, [...depth, 0]);
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