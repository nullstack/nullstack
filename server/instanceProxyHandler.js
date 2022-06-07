const instanceProxyHandler = {
  get(target, name) {
    if (!target[name]?.name?.startsWith?.('_') && !name?.startsWith?.('_') && typeof target[name] === 'function' && name !== 'constructor') {
      return (args) => {
        const context = target._scope.generateContext({ ...target._attributes, ...args });
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  }
}

export default instanceProxyHandler;