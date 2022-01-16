export default function generateKey(node, depth) {
  if (depth.length === 1) return 'application';
  return node.type.name + '/' + depth.join('-');
}