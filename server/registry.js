const registry = {}
export default registry

export function register(klass, functionName) {
  if (functionName) {
    registry[`${klass.hash}.${functionName}`] = klass[functionName]
  } else {
    registry[klass.hash] = klass
  }
}