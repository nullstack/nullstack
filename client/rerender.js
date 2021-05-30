import {isFalse, isText} from '../shared/nodes';
import client from './client';
import render from './render';
import {anchorableElement} from './anchorableNode';

export default function rerender(selector, current, next) {

  current = current === undefined ? client.virtualDom : current;
  next = next === undefined ? client.nextVirtualDom : next;

  if(next.instance) {
    next.instance._self.element = selector;
  }

  if(!client.hydrated && selector) {
    for(const element of selector.childNodes) {
      if(element.tagName && element.tagName.toLowerCase() == 'textarea' && element.childNodes.length == 0) {
        element.appendChild(document.createTextNode(''));
      }
      if(element.COMMENT_NODE === 8 && element.textContent === '#') {
        selector.removeChild(element);
      }
    }
  }

  if(isFalse(current) && isFalse(next)) {
    return;
  }

  if((isFalse(current) || isFalse(next)) && current != next) {
    const nextSelector = render(next);
    return selector.replaceWith(nextSelector);
  }

  if(current.type == 'head' && next.type == 'head') {
    return;
  }

  if(current.type == 'head' || next.type == 'head') {
    const nextSelector = render(next);
    return selector.replaceWith(nextSelector);
  }

  if (current.type !== next.type) {
    const nextSelector = render(next);
    return selector.replaceWith(nextSelector);
  }

  if (isText(current) && isText(next)) {
    if(current != next) {
      selector.nodeValue = next;
    }
    return;
  }

  if (current.type === next.type) {

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
        const key = '_event.' + eventName;
        selector.removeEventListener(eventName, current[key]);
        if(next.attributes[name]) {
          next[key] = (event) => {
            if(next.attributes.default !== true) {
              event.preventDefault();
            }
            next.attributes[name]({...next.attributes, event});
          };
          selector.addEventListener(eventName, next[key]);
        }
      } else {
        const type = typeof(next.attributes[name]);
        if(type !== 'object' && type !== 'function') {
          if(current.attributes[name] !== undefined && next.attributes[name] === undefined) {
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
    }

    if(next.attributes.html) return;

    const limit = Math.max(current.children.length, next.children.length);
    if(next.children.length > current.children.length) {
      for(let i = 0; i < current.children.length; i++) {
        rerender(selector.childNodes[i], current.children[i], next.children[i]);
      }
      for(let i = current.children.length; i < next.children.length; i++) {
        const nextSelector = render(next.children[i]);
        selector.appendChild(nextSelector);
      }
    } else if(current.children.length > next.children.length) {
      for(let i = 0; i < next.children.length; i++) {
        rerender(selector.childNodes[i], current.children[i], next.children[i]);
      }
      for(let i = current.children.length - 1; i >= next.children.length; i--) {
        selector.removeChild(selector.childNodes[i]);          
      }
    } else {
      for(let i = limit - 1; i > -1; i--) {
        if(typeof selector.childNodes[i] === 'undefined') {
          console.warn(`There an error on '${current.type}'. Please, verify`);
          return;
        }
        rerender(selector.childNodes[i], current.children[i], next.children[i]);
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