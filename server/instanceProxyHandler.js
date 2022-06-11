const instanceProxyHandler = {
  get(target, name) {
    if (typeof target[name] === 'function' && name !== 'constructor') {
      if (target[name]?.name?.startsWith?.('_') || name?.startsWith?.('_')) {
        return target[name].bind(target)
      }
      return (args) => {
        const context = target._scope.generateContext({ ...target._attributes, ...args });
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  }
}

export default instanceProxyHandler;