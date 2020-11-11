import extractParamValue from './extractParamValue';

export default function getQueryStringParams(query) {
  if(query) {
    query = (/^[?#]/.test(query) ? query.slice(1) : query);
    return query.split('&').reduce((params, param) => {
      let [key, value] = param.split('=');
      params[key] = extractParamValue(value);
      return params;
    }, {});
  } else {
    return {};
  }
};