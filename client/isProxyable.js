export default function isProxyable(value) {
  return (value !== null && typeof(value) === 'object' && value._isProxy === undefined && !(value instanceof Date));
}