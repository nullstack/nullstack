function match(node) {
  return node?.attributes?.bind !== undefined
}

function transform({ node, environment }) {
  if (!match(node)) return;
  const target = node.attributes.source;
  if (node.type === 'textarea') {
    node.children = [target[node.attributes.bind]];
  } else if (node.type === 'input' && node.attributes.type === 'checkbox') {
    node.attributes.checked = target[node.attributes.bind];
  } else {
    node.attributes.value = target[node.attributes.bind] ?? '';
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