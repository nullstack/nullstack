//import {generateContext} from './context';

const instanceProxyHandler = {
  get(target, name) {
    /*if(target[name] === undefined && typeof(target.constructor[name]) === 'function' && name !== 'constructor') {
      return async function(params = {}) {
        const request = target._request();
        const response = target._response();
        const context = generateContext({request, response, ...params});
        return await target.constructor[name](context);
      }
      //Object.defineProperty(detour, 'name', {value: name});
      //target[name] = detour;
    } else*/ 
    if(typeof(target[name]) == 'function' && !target[name].name.startsWith('_') && name !== 'constructor') {
      return (args) => {
        const context = target._scope.generateContext({...target._attributes, ...args, self: target._self});
        return target[name](context);
      }
    }
    return Reflect.get(...arguments);
  }
}

export default instanceProxyHandler;