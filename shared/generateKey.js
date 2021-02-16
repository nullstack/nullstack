export default function generateKey(depth) {
  return 'n-' + depth.join('-');
}