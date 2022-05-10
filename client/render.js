import { isFalse, isText } from '../shared/nodes';
import { anchorableElement } from './anchorableNode';
import { eventCallbacks, eventSubjects } from './events'

export default function render(node, options) {

  if (isFalse(node) || node.type === 'head') {
    return document.createComment("");
  }

  if (isText(node)) {
    return document.createTextNode(node);
  }

  const svg = (options && options.svg) || node.type === 'svg';

  let element;
  if (svg) {
    element = document.createElementNS("http://www.w3.org/2000/svg", node.type);
  } else {
    element = document.createElement(node.type);
  }

  if (node.instance) {
    node.instance._self.element = element;
  }

  for (let name in node.attributes) {
    if (name === 'html') {
      element.innerHTML = node.attributes[name];
      anchorableElement(element);
    } else if (name.startsWith('on')) {
      if (node.attributes[name] !== undefined) {
        const eventName = name.substring(2);
        const callback = (event) => {
          const subject = eventSubjects.get(element)
          if (subject.default !== true) {
            event.preventDefault();
          }
          subject[name]({ ...subject, event });
        };
        element.addEventListener(eventName, callback);
        eventCallbacks.set(element, callback)
        eventSubjects.set(element, node.attributes)
      }
    } else {
      const type = typeof (node.attributes[name]);
      if (type !== 'object' && type !== 'function') {
        if (name != 'value' && node.attributes[name] === true) {
          element.setAttribute(name, '');
        } else if (name == 'value' || (node.attributes[name] !== false && node.attributes[name] !== null && node.attributes[name] !== undefined)) {
          element.setAttribute(name, node.attributes[name]);
        }
      }
    }
  }

  if (!node.attributes.html) {
    for (let i = 0; i < node.children.length; i++) {
      const child = render(node.children[i], { svg });
      element.appendChild(child);
    }

    if (node.type == 'select') {
      element.value = node.attributes.value;
    }
  }

  return element;

}