import {generateContext} from './context';

const instanceProxyHandler = {
  get(target, name) {
    if(target[name] === undefined && typeof(target.constructor[name]) === 'function') {
      const detour = async function(params = {}) {
        const request = target._request();
        const response = target._response();
        const context = generateContext({request, response, ...params});
        return await target.constructor[name](context);
      }
      Object.defineProperty(detour, 'name', {value: name});
      target[name] = detour;
    } else if(typeof(target[name]) == 'function') {
      return (args) => {
        const context = target._scope.generateContext({...target._attributes, ...args, self: target._self});
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  }
}

export default instanceProxyHandler;