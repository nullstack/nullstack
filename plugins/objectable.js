function match(node) {
  return (
    node &&
    node.attributes !== undefined &&
    node.type !== 'body'
  )
}

function transform({ node }) {
  if (!match(node)) return;
  transformBody(node.attributes)
}

function transformBody(attributes) {
  for (const attribute in attributes) {
    if (attribute.startsWith('on') && attributes[attribute]) {
      const target = attributes.source;
      if (Array.isArray(attributes[attribute])) {
        const callbacks = attributes[attribute]
        for (let i = 0; i < callbacks.length; i++) {
          const callback = callbacks[i]
          if (typeof callback === 'object') {
            const object = callbacks[i];
            callbacks[i] = (function eventCallback() {
              Object.assign(target, object);
            }).bind(target)
          }
        }
        attributes[attribute] = callbacks;
      } else if (typeof attributes[attribute] === 'object') {
        const object = attributes[attribute];
        attributes[attribute] = (function eventCallback() {
          Object.assign(target, object);
        }).bind(target)
      }
    }
  }
}

export default { transform, transformBody, client: true }