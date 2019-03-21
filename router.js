function getQueryStringParams(query) {
  if(query) {
    query = (/^[?#]/.test(query) ? query.slice(1) : query);
    return query.split('&').reduce((params, param) => {
      let [key, value] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      if(params[key] === 'true') {
        params[key] = true;
      } else if (params[key] === 'false') {
        params[key] = false;
      } else if(/^\d+$/.test(params[key])) {
        params[key] = parseInt(params[key]);
      }
      return params;
    }, {});
  } else {
    return {};
  }
};

export function getPageWithParamsFromPath(routes, url) {
  let page;
  let [path, query] = url.split('?');
  let params = getQueryStringParams(query);
  const intentions = path.split('/');
  for(let route of routes) {
    const matchers = route.path.split('/');
    if(intentions.length == matchers.length) {
      const matches = matchers.map(function(matcher, index) {
        if(matcher.startsWith(':')) {
          params[matcher.replace(':', '')] = intentions[index];
          return true;
        } else {
          return matcher == intentions[index];
        }
      }).every((matches) => matches);
      if(matches) {
        page = route.page;
        break;
      }
    }
    if(!page) {
      let route = routes.find((route) => route.path == '*');
      if(route) {
        page = route.page;
      }
    }
  }
  return {page, params};
}
