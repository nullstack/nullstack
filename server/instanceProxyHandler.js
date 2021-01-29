const instanceProxyHandler = {
  get(target, name) {
    if(typeof(target[name]) == 'function' && !target[name].name.startsWith('_')) {
      return (args) => {
        const context = target._scope.generateContext({...target._attributes, ...args, self: target._self});
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  }
}

export default instanceProxyHandler;