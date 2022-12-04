const refMap = new WeakMap()

function setup(attributes, element) {
  const object = attributes.ref.object
  const property = attributes.ref.property
  if (typeof object[property] === 'function') {
    setTimeout(() => {
      object[property]({ ...attributes, element })
    }, 0)
  } else {
    object[property] = element
  }
  const map = refMap.get(attributes.ref.object) || {}
  map[attributes.ref.property] = true
  refMap.set(attributes.ref.object, map)
}

export function ref(attributes, element) {
  if (!attributes?.ref) return
  setup(attributes, element)
}

export function reref(attributes, element) {
  const map = refMap.get(attributes.ref.object)
  if (map?.[attributes.ref.property]) return
  setup(attributes, element)
}
