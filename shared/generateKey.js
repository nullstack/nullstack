export default function generateKey(depth) {
  return '_.' + depth.join('.');
}