function attachEvent(node) {
  const target = node.attributes.source;
  let eventName = 'oninput';
  let valueName = 'value';
  if (node.attributes.type === 'checkbox' || node.attributes.type === 'radio') {
    eventName = 'onclick';
    valueName = 'checked';
  } else if (node.type !== 'input' && node.type !== 'textarea') {
    eventName = 'onchange';
  }
  const originalEvent = node.attributes[eventName];
  node.attributes[eventName] = ({ event, value }) => {
    if (valueName === 'checked') {
      target[node.attributes.bind] = event.target[valueName];
    } else if (target[node.attributes.bind] === true || target[node.attributes.bind] === false) {
      target[node.attributes.bind] = event ? (event.target[valueName] === 'true') : value;
    } else if (typeof target[node.attributes.bind] === 'number') {
      target[node.attributes.bind] = parseFloat(event ? event.target[valueName] : value) || 0;
    } else {
      target[node.attributes.bind] = event ? event.target[valueName] : value;
    }
    if (originalEvent !== undefined) {
      setTimeout(() => {
        originalEvent({ ...node.attributes, event, value });
      }, 0);
    }
  }
}

function match(node) {
  return (
    node !== undefined &&
    node.attributes !== undefined &&
    node.attributes.bind !== undefined &&
    node.attributes.source !== undefined
  )
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
    attachEvent(node);
  }
}

export default { transform, client: true, server: true }