export default function generateKey(scope, node, depth) {
  if (node.attributes.key) return node.attributes.key;
  const prefix = depth.length === 1 ? 'application' : node.type.name + '/' + depth;
  if (node.attributes.route) {
    return prefix + (scope.context.environment.mode === 'ssg' ? scope.context.router.path : scope.context.router.url)
  }
  return prefix;
}