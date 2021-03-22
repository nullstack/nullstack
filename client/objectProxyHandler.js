import client from './client';

const objectProxyHandler = {
  set(target, name, value) {
    if(isProxyable(name, value)) {
      value._isProxy = true;
      target[name] = new Proxy(value, this);
    } else {
      target[name] = value;
    }
    if(!name.startsWith('_')) {
      client.update();
    }
    return true;
  },
  get(target, name) {
    if(name === '_isProxy') return true;
    return Reflect.get(...arguments);
  }
}

function isProxyable(name, value) {
  return (
    !name.startsWith('_') && 
    value !== null && 
    typeof(value) === 'object' && 
    value._isProxy === undefined && 
    !(value instanceof Date)
  );
}

export function generateObjectProxy(name, value) {
  if(isProxyable(name, value)) {
    if(typeof(value) === 'object') {
      for(const key of Object.keys(value)) {
        value[key] = generateObjectProxy(key, value[key]);
      }
    }
    return new Proxy(value, objectProxyHandler);
  } else {
    return value;
  }
}

export default objectProxyHandler;