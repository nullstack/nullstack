function match(node) {
  return (
    node &&
    node.type === 'a' &&
    node.attributes.href &&
    node.attributes.href.startsWith('/') &&
    !node.attributes.target
  )
}

function transform({ node, router }) {
  if (!match(node)) return
  const originalEvent = node.attributes.onclick
  node.attributes.default = true
  node.attributes.onclick = ({ event }) => {
    if (event.ctrlKey || event.shiftKey) return
    event.preventDefault()
    router.url = node.attributes.href
    if (originalEvent) {
      setTimeout(() => {
        originalEvent({ ...node.attributes, event })
      }, 0)
    }
  }
}

export default { transform, client: true }