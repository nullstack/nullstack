export default function generateKey(depth) {
  const key = 'n-' + depth.join('-');

  return key !== 'n-0' ? key : 'application';
}