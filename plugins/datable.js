import {camelize, kebabize} from '../shared/string';

function match(node) {
  return (
    node && 
    node.attributes !== undefined
  )
}

function transform({node}) {
  if(!match(node)) return;
  node.attributes.data = node.attributes.data || {};
  for(const attribute in node.attributes) {
    if(attribute.startsWith('data-')) {
      const key = camelize(attribute.slice(5));
      node.attributes.data[key] = node.attributes[attribute];
    }
  }
  for(const key in node.attributes.data) {
    const attribute = 'data-' + kebabize(key);
    node.attributes[attribute] = node.attributes.data[key];
  }
}

export default { transform, client: true, server: true }