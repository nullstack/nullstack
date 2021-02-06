export default function isProxyable(name, value) {
  return !name.startsWith('_') && value !== null && typeof(value) === 'object' && value._isProxy === undefined && !(value instanceof Date);
}