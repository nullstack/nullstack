export default function ref(node, element) {
  if (!node.attributes?.ref) return
  const object = node.attributes.ref.object
  const property = node.attributes.ref.property
  if (typeof object[property] === 'function') {
    setTimeout(() => {
      object[property]({ element })
    }, 0)
  } else {
    object[property] = element
  }
}