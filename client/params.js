import getQueryStringParams from '../shared/getQueryStringParams'
import seserializeParam from '../shared/serializeParam'
import serializeSearch from '../shared/serializeSearch'
import router from './router'
import segments, { resetSegments } from './segments'
import state from './state'

const paramsProxyHandler = {
  set(target, name, value) {
    const serializedValue = seserializeParam(value)
    target[name] = serializedValue
    const search = serializeSearch(target)
    router.url = router.path + (search ? '?' : '') + search
    return true
  },
  get(target, name) {
    if (target[name] === false) return false
    if (segments[name] === false) return false
    return target[name] || segments[name] || ''
  },
}

const params = { ...state.params }

delete state.params

const proxy = new Proxy(params, paramsProxyHandler)

export function updateParams(query) {
  resetSegments()
  const delta = getQueryStringParams(query)
  for (const key of Object.keys({ ...delta, ...params })) {
    params[key] = delta[key]
  }
  return proxy
}

export default proxy
