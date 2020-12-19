import client from './client';

export default function objectEvent(node) {
  for(const attribute in node.attributes) {
    if(attribute.startsWith('on') && typeof(node.attributes[attribute]) === 'object') {
      const target = node.attributes.source;
      const keys = node.attributes[attribute];
      node.attributes[attribute] = (function() {
        for(const key in keys) {
          target[key] = keys[key];
        }
        client.update();
      }).bind(target);
    }
  }
}