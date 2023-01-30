import generateTruthyString from '../shared/generateTruthyString'
import { isFalse, isText } from '../shared/nodes'
import { anchorableElement } from './anchorableNode'
import { eventSubjects, generateCallback } from './events'
import { ref } from './ref'

export default function render(node, options) {
  if (isFalse(node) || node.type === 'head') {
    node.element = document.createComment('')
    return node.element
  }

  if (isText(node)) {
    node.element = document.createTextNode(node.text)
    return node.element
  }

  const svg = (options && options.svg) || node.type === 'svg'

  if (svg) {
    node.element = document.createElementNS('http://www.w3.org/2000/svg', node.type)
  } else {
    node.element = document.createElement(node.type)
  }

  ref(node.attributes, node.element)

  for (const name in node.attributes) {
    if (name === 'debounce') continue
    if (name === 'html') {
      node.element.innerHTML = node.attributes[name]
      node.head || anchorableElement(node.element)
    } else if (name.startsWith('on')) {
      if (node.attributes[name] !== undefined) {
        const eventName = name.substring(2)
        const callback = generateCallback(node.element, name)
        node.element.addEventListener(eventName, callback)
        eventSubjects.set(node.element, node.attributes)
      }
    } else {
      let nodeValue
      if ((name === 'class' || name === 'style') && Array.isArray(node.attributes[name])) {
        nodeValue = generateTruthyString(node.attributes[name])
      } else {
        nodeValue = node.attributes[name]
      }
      const type = typeof nodeValue
      if (type !== 'object' && type !== 'function') {
        if (name !== 'value' && nodeValue === true) {
          node.element.setAttribute(name, '')
        } else if (name === 'value' || (nodeValue !== false && nodeValue !== null && nodeValue !== undefined)) {
          node.element.setAttribute(name, nodeValue)
        }
      }
    }
  }

  if (!node.attributes.html) {
    for (let i = 0; i < node.children.length; i++) {
      const child = render(node.children[i], { svg })
      node.element.appendChild(child)
    }

    if (node.type === 'select') {
      node.element.value = node.attributes.value
    }
  }

  return node.element
}
