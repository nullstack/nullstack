export function isFalse(node) {
  if(node === undefined || node === null || node === false) return true;
  if(typeof(node) !== 'object') return false;
  return node.type === undefined || node.type === null || node.type === false;
}

export function isClass(node) {
  return typeof(node.type) === 'function' && node.type.prototype && typeof(node.type.prototype.render) === 'function';
}

export function isFunction(node) {
  return typeof(node.type) === 'function';
}

export function isText(node) {
  return typeof(node.children) === 'undefined';
}