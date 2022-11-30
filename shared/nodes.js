/* eslint-disable no-undefined */
export function isUndefined(node) {
  if (node === undefined) return true
  if (node === null) return false
  return Object.prototype.hasOwnProperty.call(node, 'type') && node.type === undefined
}

export function isFalse(node) {
  if (node === null || node === false) return true
  return (Object.prototype.hasOwnProperty.call(node, 'type') && node.type === null) || node.type === false
}

export function isClass(node) {
  return typeof node.type === 'function' && node.type.prototype && typeof node.type.prototype.render === 'function'
}

export function isFunction(node) {
  return typeof node.type === 'function'
}

export function isText(node) {
  return node.type === 'text'
}
