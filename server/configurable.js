import environment from './environment';

function camelize(key) {
  return key.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

const configurableProxyHandler = {
  get(target, name) {
    if(target[name]) {
      return target[name];
    } else {
      const key = environment.production ? 'production' : 'development';
      return target[key] ? target[key][name] : target[name];
    }
  }
}

export function proxyConfigurable(target, label) {
  target.production = {};
  target.development = {};
  for(const key in process.env) {
    const lookup = `NULLSTACK_${label}_`;
    if(key.startsWith(lookup)) {
      const camelCaseKey = camelize(key.substring(lookup.length));
      target[camelCaseKey] = process.env[key];
    }
  }
  return new Proxy(target, configurableProxyHandler);
}

export function freezeConfigurable(target) {
  if(environment.production) {
    for(const [key, value] of Object.entries(target.production)) {
      target[key] = value;
    }
  } else {
    for(const [key, value] of Object.entries(target.development)) {
      target[key] = value;
    }
  }
  delete target.production;
  delete target.development;
  Object.freeze(target);
}