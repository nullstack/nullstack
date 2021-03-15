export default function generateKey(depth) {
  if(depth.length === 1) return 'application';
  return 'n-' + depth.join('-');
}