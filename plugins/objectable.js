export default class Objectable {

  match({node}) {
    return (
      node &&
      node.attributes !== undefined
    )
  }

  transform({node}) {
    for(const attribute in node.attributes) {
      if(attribute.startsWith('on') && typeof(node.attributes[attribute]) === 'object') {
        const target = node.attributes.source;
        const object = node.attributes[attribute];
        node.attributes[attribute] = (function() {
          Object.assign(target, object);
        }).bind(target);
      }
    }
  }

}