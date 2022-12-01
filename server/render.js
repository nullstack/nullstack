import { isFalse } from '../shared/nodes'
import { sanitizeHtml } from '../shared/sanitizeString'
import renderAttributes from './renderAttributes'

function isSelfClosing(type) {
  if (type === 'input') return true
  if (type === 'img') return true
  if (type === 'link') return true
  if (type === 'meta') return true
  if (type === 'br') return true
  if (type === 'hr') return true
  if (type === 'area') return true
  if (type === 'base') return true
  if (type === 'col') return true
  if (type === 'embed') return true
  if (type === 'param') return true
  if (type === 'source') return true
  if (type === 'track') return true
  if (type === 'wbr') return true
  if (type === 'menuitem') return true
  return false
}

function renderBody(node, scope, next) {
  if (isFalse(node)) {
    return '<!---->'
  }
  if (node.type === 'text') {
    const text = node.text === '' ? ' ' : sanitizeHtml(node.text.toString())
    return next && next.type === 'text' ? `${text}<!--#-->` : text
  }
  let element = `<${node.type}`
  element += renderAttributes(node.attributes)
  if (isSelfClosing(node.type)) {
    element += '/>'
  } else {
    element += '>'
    if (node.attributes.html) {
      const source = node.attributes.html
      element += source
    } else if (node.type === 'textarea') {
      element += node.children[0].text
    } else {
      for (let i = 0; i < node.children.length; i++) {
        element += renderBody(node.children[i], scope, node.children[i + 1])
      }
    }
    element += `</${node.type}>`
  }
  return element
}

function renderHead(scope) {
  const limit = scope.nextHead.length
  for (let i = 0; i < limit; i++) {
    const node = scope.nextHead[i]
    if (isFalse(node)) {
      continue
    }
    scope.head += `<${node.type}`
    scope.head += renderAttributes(node.attributes)
    if (isSelfClosing(node.type)) {
      scope.head += '/>'
    } else {
      scope.head += '>'
      scope.head += node.attributes.html
      scope.head += `</${node.type}>`
    }
  }
}

export default function render(node, scope, next) {
  renderHead(scope)
  return renderBody(node, scope, next)
}
