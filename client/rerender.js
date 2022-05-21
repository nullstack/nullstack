import { isUndefined, isFalse, isText } from '../shared/nodes';
import { anchorableElement } from './anchorableNode';
import client from './client';
import render from './render';
import { generateCallback, eventCallbacks, eventSubjects } from './events'
import generateTruthyString from '../shared/generateTruthyString';

const head = document.head
const body = document.body

function getElement(node) {
  if (node.element) return node.element
  node.element = document.getElementById(node.attributes.id)
  return node.element
}

function updateAttributes(selector, currentAttributes, nextAttributes) {
  const attributeNames = Object.keys({ ...currentAttributes, ...nextAttributes });
  for (const name of attributeNames) {
    if (name === 'html') {
      if (nextAttributes[name] !== currentAttributes[name]) {
        selector.innerHTML = nextAttributes[name];
        anchorableElement(selector);
      }
    } else if (name === 'checked') {
      if (nextAttributes[name] !== selector.value) {
        selector.checked = nextAttributes[name];
      }
    } else if (name === 'value') {
      if (nextAttributes[name] !== selector.value) {
        selector.value = nextAttributes[name];
      }
    } else if (name.startsWith('on')) {
      const eventName = name.substring(2);
      if (eventCallbacks.has(selector) && !nextAttributes[name]) {
        selector.removeEventListener(eventName, eventCallbacks.get(selector));
      }
      if (nextAttributes[name]) {
        if (!eventCallbacks.has(selector)) {
          const callback = generateCallback(selector, name)
          selector.addEventListener(eventName, callback);
          eventCallbacks.set(selector, callback)
        }
        eventSubjects.set(selector, nextAttributes)
      }
    } else {
      let currentValue;
      if ((name === 'class' || name === 'style') && Array.isArray(currentAttributes[name])) {
        currentValue = generateTruthyString(currentAttributes[name])
      } else {
        currentValue = currentAttributes[name]
      }
      let nextValue;
      if ((name === 'class' || name === 'style') && Array.isArray(nextAttributes[name])) {
        nextValue = generateTruthyString(nextAttributes[name])
      } else {
        nextValue = nextAttributes[name]
      }
      const type = typeof nextValue;
      if (type !== 'object' && type !== 'function') {
        if (currentValue !== undefined && nextValue === undefined) {
          selector.removeAttribute(name);
        } else if (currentValue !== nextValue) {
          if (name != 'value' && nextValue === false || nextValue === null || nextValue === undefined) {
            selector.removeAttribute(name);
          } else if (name != 'value' && nextValue === true) {
            selector.setAttribute(name, '');
          } else {
            selector.setAttribute(name, nextValue);
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

  if ((isFalse(current) || isFalse(next)) && current.type != next.type) {
    const nextSelector = render(next);
    selector.replaceWith(nextSelector);
    if (current.type !== 'head' && next.type !== 'head') {
      return
    }
  }

  if (current.type === 'head' ^ next.type === 'head') {
    const nextSelector = render(next);
    getElement(current).replaceWith(nextSelector);
  }

  if (current.type !== 'head' && next.type === 'head') {
    const limit = next.children.length;
    for (let i = limit - 1; i > -1; i--) {
      const nextSelector = render(next.children[i]);
      head.appendChild(nextSelector)
    }
    return
  }

  if (current.type === 'head' && next.type !== 'head') {
    const limit = current.children.length;
    for (let i = limit - 1; i > -1; i--) {
      getElement(current.children[i]).remove()
    }
    return
  }

  if (next.type === 'head') {
    const limit = Math.max(current.children.length, next.children.length);
    for (let i = limit - 1; i > -1; i--) {
      if (isUndefined(current.children[i]) && !isFalse(next.children[i])) {
        const nextSelector = render(next.children[i]);
        head.appendChild(nextSelector)
      } else if (isUndefined(next.children[i]) && !isFalse(current.children[i])) {
        getElement(current.children[i]).remove()
      } else if (!isFalse(current.children[i]) && !isFalse(next.children[i])) {
        if (current.children[i].type === next.children[i].type) {
          next.children[i].element = getElement(current.children[i])
          updateAttributes(next.children[i].element, current.children[i].attributes, next.children[i].attributes)
        } else {
          getElement(current.children[i]).remove()
          const nextSelector = render(next.children[i]);
          head.appendChild(nextSelector)
        }
      } else if (isFalse(current.children[i]) && !isFalse(next.children[i])) {
        const nextSelector = render(next.children[i]);
        head.appendChild(nextSelector)
      } else if (current.children[i].type) {
        getElement(current.children[i]).remove()
      }
    }
    return
  }

  if (current.type !== next.type) {
    const nextSelector = render(next);
    return selector.replaceWith(nextSelector);
  }

  if (isText(current) && isText(next)) {
    if (current.text !== next.text) {
      selector.textContent = next.text;
    }
    return;
  }

  if (current.type === next.type) {
    updateAttributes(selector, current.attributes, next.attributes)

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
        selector.childNodes[i].remove()
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

    if (next.type === 'textarea') {
      selector.value = next.children[0].text;
    }

    if (next.type === 'select') {
      selector.value = next.attributes.value;
    }

  }

}

export default function rerender() {
  _rerender(client.virtualDom, client.nextVirtualDom)
  updateAttributes(body, client.currentBody, client.nextBody)
}