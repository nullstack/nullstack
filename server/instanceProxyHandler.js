import {generateContext} from './context';

const instanceProxyHandler = {
  get(target, name) {
    if(target.attributes && target.attributes.proxy && target.attributes.proxy[name] !== undefined && target[name] !== undefined) {
      return target.attributes.proxy[name];
    }
    if(target[name] === undefined && typeof(target.constructor[name]) === 'function') {
      const detour = async function(params = {}) {
        const request = target._request();
        const response = target._response();
        const context = generateContext({request, response, ...params});
        return await target.constructor[name](context);
      }
      target[name] = detour;
    } else if(typeof(target[name]) == 'function') {
      return (args) => {
        const context = generateContext({...target._context, ...args});
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  },
  set(target, name, value) {
    if(target.attributes && target.attributes.proxy && target.attributes.proxy[name] !== undefined && target[name] !== undefined) {
      target.attributes.proxy[name] = value;
    }
    const result = Reflect.set(...arguments);
    return result;
  }
}

export default instanceProxyHandler;