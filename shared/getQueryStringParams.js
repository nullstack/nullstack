import extractParamValue from './extractParamValue'

export default function getQueryStringParams(url) {
  const query = url.split('?')[1]
  if (query) {
    return query.split('&').reduce((params, param) => {
      const [key, value] = param.split('=')
      params[key] = extractParamValue(value)
      return params
    }, {})
  }
  return {}
}
