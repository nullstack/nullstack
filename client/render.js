import { isFalse, isText } from '../shared/nodes';
import { anchorableElement } from './anchorableNode';
import { eventCallbacks, eventSubjects, generateCallback } from './events'

export default function render(node, options) {

  if (isFalse(node) || node.type === 'head') {
    node.element = document.createComment("");
    return node.element
  }

  if (isText(node)) {
    node.element = document.createTextNode(node.text);
    return node.element
  }

  const svg = (options && options.svg) || node.type === 'svg';

  if (svg) {
    node.element = document.createElementNS("http://www.w3.org/2000/svg", node.type);
  } else {
    node.element = document.createElement(node.type);
  }

  if (node.instance) {
    node.instance._self.element = node.element;
  }

  for (let name in node.attributes) {
    if (name === 'html') {
      node.element.innerHTML = node.attributes[name];
      node.head || anchorableElement(node.element);
    } else if (name.startsWith('on')) {
      if (node.attributes[name] !== undefined) {
        const eventName = name.substring(2);
        const callback = generateCallback(node.element, name)
        node.element.addEventListener(eventName, callback);
        eventCallbacks.set(node.element, callback)
        eventSubjects.set(node.element, node.attributes)
      }
    } else {
      const type = typeof node.attributes[name];
      if (type !== 'object' && type !== 'function') {
        if (name != 'value' && node.attributes[name] === true) {
          node.element.setAttribute(name, '');
        } else if (name === 'value' || (node.attributes[name] !== false && node.attributes[name] !== null && node.attributes[name] !== undefined)) {
          node.element.setAttribute(name, node.attributes[name]);
        }
      }
    }
  }

  if (!node.attributes.html) {
    for (let i = 0; i < node.children.length; i++) {
      const child = render(node.children[i], { svg });
      node.element.appendChild(child);
    }

    if (node.type === 'select') {
      node.element.value = node.attributes.value;
    }
  }

  return node.element;

}