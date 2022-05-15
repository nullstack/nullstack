import { camelize, kebabize } from '../shared/string';

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
  attributes.data = attributes.data || {};
  for (const attribute in attributes) {
    if (attribute.startsWith('data-')) {
      const key = camelize(attribute.slice(5));
      attributes.data[key] = attributes[attribute];
    }
  }
  for (const key in attributes.data) {
    const attribute = 'data-' + kebabize(key);
    attributes[attribute] = attributes.data[key];
  }
}

export default { transform, transformBody, client: true, server: true }