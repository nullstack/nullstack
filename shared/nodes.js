export function isFalse(node) {
  return node === undefined || node === null || node === false || node.type === false;
}

export function isClass(node) {
  return typeof(node.type) === 'function' && typeof(node.type.prototype.render) === 'function';
}

export function isFunction(node) {
  return typeof(node.type) === 'function' && node.type.prototype === undefined;
}

export function isStatic(node) {
  return typeof(node.type) === 'function' && typeof(node.type.render) === 'function';
}

export function isText(node) {
  return node !== 'Fragment' && typeof(node.children) === 'undefined';
}

export function isRoutable(node) {
  return node && node.attributes !== undefined && node.attributes.route !== undefined;
}

export function isBindable(node) {
  return node !== undefined && node.attributes !== undefined && node.attributes.bind !== undefined;
}

export function isAnchorable(node) {
  return node.type === 'a' && node.attributes.href && node.attributes.href.startsWith('/') && !node.attributes.target;
}

export function isParameterizable(node) {
  return node && node.attributes && (node.attributes.params || node.attributes.path);
}