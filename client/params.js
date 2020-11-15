import router from './router';
import getQueryStringParams from '../shared/getQueryStringParams';
import seserializeParam from '../shared/serializeParam';
import serializeSearch from '../shared/serializeSearch';
import context from './context';

const paramsProxyHandler = {
  set(target, name, value) {
    const serializedValue = seserializeParam(value);
    target[name] = serializedValue;
    if(!router._segments[name]) {
      const search = serializeSearch(target);
      router.url = router.path + (search ? '?' : '') + search;
    }
    return true;
  },
  get(target, name) {
    return target[name] || '';
  }
}

export function generateParams(query) {
  const params = getQueryStringParams(query);
  router._resetSegments();
  if(!context.params) {
    return new Proxy(params, paramsProxyHandler);
  } else {
    for(const key of Object.keys({...params, ...context.params})) {
      context.params[key] = params[key];
    }
    return context.params;
  }
}