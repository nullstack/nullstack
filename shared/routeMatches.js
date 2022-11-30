/* eslint-disable no-continue */
import extractLocation from '../shared/extractLocation'
import extractParamValue from './extractParamValue'

export default function routeMatches(url, route) {
  const { path } = extractLocation(url)
  const urlPaths = path.split('/')
  const routePaths = route.split('/')
  const params = {}
  const length = Math.max(urlPaths.length, routePaths.length)
  let catchall = false
  for (let i = 0; i < length; i++) {
    if (catchall) {
      continue
    } else if (routePaths[i] === '*') {
      catchall = true
    } else if (routePaths[i] && routePaths[i].startsWith(':')) {
      const key = routePaths[i].replace(':', '')
      params[key] = extractParamValue(urlPaths[i])
    } else if (routePaths[i] !== urlPaths[i]) {
      return false
    }
  }
  return params
}
