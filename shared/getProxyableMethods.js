export default function getProxyableMethods(target) {
  let properties = new Set();
  let current = target;
  do {
    Object.getOwnPropertyNames(current).map(name => properties.add(name))
  } while ((current = Object.getPrototypeOf(current)) && current != Object.prototype)
  return [...properties.keys()].filter((name) => {
    return name !== 'constructor' && typeof target[name] === 'function'
  });
}