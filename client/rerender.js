import generateTruthyString from '../shared/generateTruthyString'
import { isFalse, isText, isUndefined } from '../shared/nodes'
import { anchorableElement } from './anchorableNode'
import client from './client'
import { eventCallbacks, eventSubjects, generateCallback } from './events'
import { reref } from './ref'
import render from './render'

function updateAttributes(selector, currentAttributes, nextAttributes) {
  const attributeNames = Object.keys({ ...currentAttributes, ...nextAttributes })
  for (const name of attributeNames) {
    if (name === 'debounce') continue
    if (name === 'ref' && nextAttributes?.ref?.property) {
      reref(nextAttributes, selector)
    } else if (name === 'html') {
      if (nextAttributes[name] !== currentAttributes[name]) {
        selector.innerHTML = nextAttributes[name]
        anchorableElement(selector)
      }
    } else if (name === 'checked' || name === 'value') {
      if (nextAttributes[name] !== currentAttributes[name] && nextAttributes[name] !== selector[name]) {
        selector[name] = nextAttributes[name]
      }
    } else if (name.startsWith('on')) {
      const eventName = name.substring(2)
      const eventNames = eventCallbacks.get(selector)
      if (!eventNames) {
        selector.addEventListener(eventName, generateCallback(selector, name))
      } else {
        const callback = eventNames[name]
        if (callback && !nextAttributes[name]) {
          selector.removeEventListener(eventName, callback)
          delete eventNames[name]
        } else if (nextAttributes[name]) {
          if (!callback) {
            selector.addEventListener(eventName, generateCallback(selector, name))
          }
          eventSubjects.set(selector, nextAttributes)
        }
      }
    } else {
      let currentValue
      if ((name === 'class' || name === 'style') && Array.isArray(currentAttributes[name])) {
        currentValue = generateTruthyString(currentAttributes[name])
      } else {
        currentValue = currentAttributes[name]
      }
      let nextValue
      if ((name === 'class' || name === 'style') && Array.isArray(nextAttributes[name])) {
        nextValue = generateTruthyString(nextAttributes[name])
      } else {
        nextValue = nextAttributes[name]
      }
      const type = typeof nextValue
      if (type !== 'object' && type !== 'function') {
        if (currentValue !== undefined && nextValue === undefined) {
          selector.removeAttribute(name)
        } else if (currentValue !== nextValue) {
          if ((name !== 'value' && nextValue === false) || nextValue === null || nextValue === undefined) {
            selector.removeAttribute(name)
          } else if (name !== 'value' && nextValue === true) {
            selector.setAttribute(name, '')
          } else {
            selector.setAttribute(name, nextValue)
          }
        }
      }
    }
  }
}

function updateHeadChild(current, next) {
  if (isUndefined(current) && !isUndefined(next)) {
    const nextSelector = render(next)
    client.head.append(nextSelector)
    return
  }
  if (!isUndefined(current) && isUndefined(next)) {
    current.element.remove()
    return
  }
  next.element = current.element
  if (isFalse(current) && isFalse(next)) {
    return
  }
  if (current.type !== next.type) {
    const nextSelector = render(next)
    current.element.replaceWith(nextSelector)
    return
  }
  updateAttributes(current.element, current.attributes, next.attributes)
}

function updateHeadChildren(currentChildren, nextChildren) {
  const limit = Math.max(currentChildren.length, nextChildren.length)
  for (let i = 0; i < limit; i++) {
    updateHeadChild(currentChildren[i], nextChildren[i])
  }
}

function _rerender(current, next) {
  const selector = current.element
  next.element = current.element

  if (isFalse(current) && isFalse(next)) {
    return
  }

  if (current.type !== next.type) {
    const nextSelector = render(next)
    selector.replaceWith(nextSelector)
    return
  }

  if (current.type === 'textarea') {
    current.attributes.value = current.children[0].text
    next.attributes.value = next.children[0].text
    updateAttributes(selector, current.attributes, next.attributes)
    return
  }

  if (isText(current) && isText(next)) {
    if (current.text !== next.text) {
      selector.textContent = next.text
    }
    return
  }

  if (!next.attributes.html) {
    const limit = Math.max(current.children.length, next.children.length)
    if (next.children.length > current.children.length) {
      for (let i = 0; i < current.children.length; i++) {
        _rerender(current.children[i], next.children[i])
      }
      for (let i = current.children.length; i < next.children.length; i++) {
        const nextSelector = render(next.children[i])
        selector.appendChild(nextSelector)
      }
    } else if (current.children.length > next.children.length) {
      for (let i = 0; i < next.children.length; i++) {
        _rerender(current.children[i], next.children[i])
      }
      for (let i = current.children.length - 1; i >= next.children.length; i--) {
        selector.childNodes[i].remove()
      }
    } else {
      for (let i = limit - 1; i > -1; i--) {
        _rerender(current.children[i], next.children[i])
      }
    }
  }

  updateAttributes(selector, current.attributes, next.attributes)
}

export default function rerender() {
  _rerender(client.virtualDom, client.nextVirtualDom)
  updateAttributes(client.body, client.currentBody, client.nextBody)
  updateHeadChildren(client.currentHead, client.nextHead)
  client.virtualDom = client.nextVirtualDom
  client.nextVirtualDom = null
  client.currentBody = client.nextBody
  client.nextBody = {}
  client.currentHead = client.nextHead
  client.nextHead = []
}
