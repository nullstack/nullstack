function match(node) {
  return node?.attributes?.bind !== undefined
}

function transform({ node, environment }) {
  if (!match(node)) return;
  const object = node.attributes.bind.object;
  const property = node.attributes.bind.property;
  if (node.type === 'textarea') {
    node.children = [object[property]];
  } else if (node.type === 'input' && node.attributes.type === 'checkbox') {
    node.attributes.checked = object[property];
  } else {
    node.attributes.value = object[property] ?? '';
  }
  node.attributes.name = node.attributes.name || node.attributes.bind;
  if (environment.client) {
    if (node.attributes.type === 'checkbox' || node.attributes.type === 'radio') {
      node.attributes.onclick ??= true;
    } else if (node.type !== 'input' && node.type !== 'textarea') {
      node.attributes.onchange ??= true;
    } else {
      node.attributes.oninput ??= true;
    }
  }
}

export default { transform, client: true, server: true }