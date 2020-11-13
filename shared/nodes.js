export function isFalse(node) {
  return node === undefined || node === null || node === false || node.type === false;
}

export function isClass(node) {
  return typeof(node.type) === 'function' && typeof(node.type.prototype.render) === 'function';
}

export function isFunction(node) {
  return typeof(node.type) === 'function' && node.type.prototype === undefined;
}

export function isRoutable(node) {
  return node && node.attributes !== undefined && node.attributes.route !== undefined;
}

export function isText(node) {
  return node !== 'Fragment' && typeof(node.children) === 'undefined';
}