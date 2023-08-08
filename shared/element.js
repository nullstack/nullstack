import fragment from './fragment'
import runtimeError from './runtimeError'

const seed = Object.freeze([])

function normalize(child) {
  return child ?? false
}

export default function element(type, props, ...children) {
  if (type === undefined) {
    runtimeError.add(props?.__source, { disableProductionThrow: true })
  }
  children = seed.concat(...children).map(normalize)
  if (type === 'textarea') {
    children = [children.join('')]
  }
  const attributes = { ...props, children }
  if (type === 'style' && !attributes.html) {
    attributes.html = children.join('')
  }
  if (type === 'element') {
    type = attributes.tag || fragment
    delete attributes.tag
  }
  if (typeof type === 'function' && type.render !== undefined) {
    return { type, attributes, children: null }
  }
  return { type, attributes, children }
}
