import noop from '../shared/noop'

function match(node) {
  return node?.attributes?.bind !== undefined
}

function transform({ node, environment }) {
  if (!match(node)) return
  const object = node.attributes.bind.object ?? {}
  const property = node.attributes.bind.property
  if (node.type === 'textarea') {
    node.children = [object[property] ?? '']
  } else if (node.type === 'input' && node.attributes.type === 'checkbox') {
    node.attributes.checked = object[property]
  } else if (node.type === 'input' && node.attributes.type === 'date' && object[property] instanceof Date) {
    const yyyy = object[property].getFullYear()
    const mm = (object[property].getMonth() + 1).toString().padStart(2, '0')
    const dd = object[property].getDate().toString().padStart(2, '0')
    node.attributes.value = `${yyyy}-${mm}-${dd}`
  } else {
    node.attributes.value = object[property] ?? ''
  }
  if (environment.client) {
    if (node.attributes.type === 'checkbox' || node.attributes.type === 'radio') {
      node.attributes.onclick ??= noop
    } else if (node.type !== 'input' && node.type !== 'textarea') {
      node.attributes.onchange ??= noop
    } else {
      node.attributes.oninput ??= noop
    }
  }
}

export default { transform, client: true, server: true }
