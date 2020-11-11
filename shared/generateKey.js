export default function generateKey(node, depth) {
  return depth.join('.');
}