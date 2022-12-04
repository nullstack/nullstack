import { generateBase } from './project'
import worker from './worker'

export function absolute(path) {
  if (path.indexOf('//') === -1) {
    return `${generateBase()}${path}`
  }
  return path
}

export function cdn(path) {
  if (!worker.cdn) return path
  if (path.indexOf('//') === -1) {
    return `${worker.cdn}${path}`
  }
  return path
}

export function cdnOrAbsolute(path) {
  if (path.indexOf('//') > -1) return path
  if (worker.cdn) return `${worker.cdn}${path}`
  return `${generateBase()}${path}`
}
