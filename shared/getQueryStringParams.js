import extractParamValue from './extractParamValue';

export default function getQueryStringParams(url) {
  const [path, query] = url.split('?');
  if(query) {
    return query.split('&').reduce((params, param) => {
      let [key, value] = param.split('=');
      params[key] = extractParamValue(value);
      return params;
    }, {});
  } else {
    return {};
  }
};