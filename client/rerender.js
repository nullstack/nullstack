import { isUndefined, isFalse, isText } from '../shared/nodes';
import { anchorableElement } from './anchorableNode';
import client from './client';
import render from './render';
import { eventCallbacks, eventSubjects } from './events'

function updateAttributes(selector, current, next) {
  const attributeNames = Object.keys({ ...current.attributes, ...next.attributes });
  for (const name of attributeNames) {
    if (name === 'html') {
      if (next.attributes[name] !== current.attributes[name]) {
        selector.innerHTML = next.attributes[name];
      }
      anchorableElement(selector);
    } else if (name === 'checked') {
      if (next.attributes[name] !== selector.value) {
        selector.checked = next.attributes[name];
      }
    } else if (name === 'value') {
      if (next.attributes[name] !== selector.value) {
        selector.value = next.attributes[name];
      }
    } else if (name.startsWith('on')) {
      const eventName = name.substring(2);
      if (eventCallbacks.has(selector) && !next.attributes[name]) {
        selector.removeEventListener(eventName, eventCallbacks.get(selector));
      }
      if (next.attributes[name]) {
        if (!eventCallbacks.has(selector)) {
          const callback = (event) => {
            const subject = eventSubjects.get(selector)
            if (subject.default !== true) {
              event.preventDefault();
            }
            subject[name]({ ...subject, event });
          };
          selector.addEventListener(eventName, callback);
          eventCallbacks.set(selector, callback)
        }
        eventSubjects.set(selector, next.attributes)
      }
    } else {
      const type = typeof (next.attributes[name]);
      if (type !== 'object' && type !== 'function') {
        if (current.attributes[name] !== undefined && next.attributes[name] === undefined) {
          selector.removeAttribute(name);
        } else if (current.attributes[name] !== next.attributes[name]) {
          if (name != 'value' && next.attributes[name] === false || next.attributes[name] === null || next.attributes[name] === undefined) {
            selector.removeAttribute(name);
          } else if (name != 'value' && next.attributes[name] === true) {
            selector.setAttribute(name, '');
          } else {
            selector.setAttribute(name, next.attributes[name]);
          }
        }
      }
    }
  }
}

function _rerender(current, next) {

  const selector = current.element
  next.element = current.element

  if (next.instance) {
    next.instance._self.element = selector;
  }

  if (isFalse(current) && isFalse(next)) {
    return;
  }

  if ((isFalse(current) || isFalse(next)) && current != next) {
    const nextSelector = render(next);
    selector.replaceWith(nextSelector);
    if (current.type !== 'head' && next.type !== 'head') {
      return
    }
  }

  if (current.type == 'head' ^ next.type == 'head') {
    const nextSelector = render(next);
    selector.replaceWith(nextSelector);
  }

  if (current.type !== 'head' && next.type === 'head') {
    const limit = next.children.length;
    for (let i = limit - 1; i > -1; i--) {
      const nextSelector = render(next.children[i]);
      document.querySelector('head').appendChild(nextSelector)
    }
    return
  }

  if (current.type === 'head' && next.type !== 'head') {
    const limit = current.children.length;
    for (let i = limit - 1; i > -1; i--) {
      document.querySelector(`[data-n="${current.children[i].attributes['data-n']}"]`).remove()
    }
    return
  }

  if (next.type === 'head') {
    const limit = Math.max(current.children.length, next.children.length);
    for (let i = limit - 1; i > -1; i--) {
      if (isUndefined(current.children[i]) && !isFalse(next.children[i])) {
        const nextSelector = render(next.children[i]);
        document.querySelector('head').appendChild(nextSelector)
      } else if (isUndefined(next.children[i]) && !isFalse(current.children[i])) {
        current.children[i].element.remove()
      } else if (!isFalse(current.children[i]) && !isFalse(next.children[i])) {
        if (current.children[i].type === next.children[i].type) {
          next.children[i].element = current.children[i].element
          const element = document.querySelector(`[data-n="${next.children[i].attributes['data-n']}"]`)
          updateAttributes(element, current.children[i], next.children[i])
        } else {
          document.querySelector(`[data-n="${current.children[i].attributes['data-n']}"]`).remove()
          const nextSelector = render(next.children[i]);
          document.querySelector('head').appendChild(nextSelector)
        }
      } else if (isFalse(current.children[i]) && !isFalse(next.children[i])) {
        const nextSelector = render(next.children[i]);
        document.querySelector('head').appendChild(nextSelector)
      } else {
        current.children[i].element.remove()
      }
    }
    return
  }

  if (current.type !== next.type) {
    const nextSelector = render(next);
    return selector.replaceWith(nextSelector);
  }

  if (isText(current) && isText(next)) {
    if (current != next) {
      selector.nodeValue = next.text;
    }
    return;
  }

  if (current.type === next.type) {
    updateAttributes(selector, current, next)

    if (next.attributes.html) return;

    const limit = Math.max(current.children.length, next.children.length);
    if (next.children.length > current.children.length) {
      for (let i = 0; i < current.children.length; i++) {
        _rerender(current.children[i], next.children[i]);
      }
      for (let i = current.children.length; i < next.children.length; i++) {
        const nextSelector = render(next.children[i]);
        selector.appendChild(nextSelector);
      }
    } else if (current.children.length > next.children.length) {
      for (let i = 0; i < next.children.length; i++) {
        _rerender(current.children[i], next.children[i]);
      }
      for (let i = current.children.length - 1; i >= next.children.length; i--) {
        selector.removeChild(selector.childNodes[i]);
      }
    } else {
      for (let i = limit - 1; i > -1; i--) {
        if (typeof selector.childNodes[i] === 'undefined') {
          console.error(
            `${current.type.toUpperCase()} expected tag ${current.children[i].type.toUpperCase()} to be child at index ${i} but instead found undefined. This error usually happens because of an invalid HTML hierarchy or changes in comparisons after serialization.`,
            selector
          )
          throw new Error('Virtual DOM does not match the DOM.')
          return;
        }
        _rerender(current.children[i], next.children[i]);
      }
    }

    if (next.type == 'textarea') {
      selector.value = next.children.reduce((t, c) => t + c.text, '');
    }

    if (next.type == 'select') {
      selector.value = next.attributes.value;
    }

  }

}

export default function rerender() {
  _rerender(client.virtualDom, client.nextVirtualDom)
}

export function hydrate(selector, node) {
  if (node?.attributes?.['data-n'] !== undefined) {
    node.element = document.querySelector(`[data-n="${node.attributes['data-n']}"]`)
    return
  }
  node.element = selector
  for (const element of selector.childNodes) {
    if (element.tagName && element.tagName.toLowerCase() == 'textarea' && element.childNodes.length == 0) {
      element.appendChild(document.createTextNode(''));
    }
    if (element.COMMENT_NODE === 8 && element.textContent === '#') {
      selector.removeChild(element);
    }
  }
  if (!node.children) return
  const limit = node.children.length;
  for (let i = limit - 1; i > -1; i--) {
    hydrate(selector.childNodes[i], node.children[i])
  }
}