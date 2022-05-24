import generateProps from '../shared/generateProps'

export function generateContext(context) {
  const contextProxyHandler = {
    set(target, name, value) {
      return context[name] = value;
    },
    get(target, name) {
      if (target[name] !== undefined) return target[name];
      return name === 'props' ? generateProps(context, target) : context[name]
    }
  }
  return function (temporary) {
    return new Proxy({ ...context, ...temporary }, contextProxyHandler);
  }
}