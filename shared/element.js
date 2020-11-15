function flattenChildren(children) {
  children = [].concat.apply([], children).map((child) => {
    if(child === null || child === undefined) return false;
    if(child.type === 'Fragment') return flattenChildren(child.children);
    return child;
  });
  return [].concat.apply([], children);
}

export default function element(type, attributes = {}, ...children) {
  if(attributes === null) {
    attributes = {};
  }
  children = flattenChildren(children);
  if(type === 'textarea') {
    children = [children.join('')];
  }
  if(type === 'element') {
    type = attributes.tag;
    delete attributes.tag;
  }
  attributes.children = children;
  if(typeof(type) === 'function' && type.render !== undefined) {
    return {type, attributes, children: null}
  }
  return {type, attributes, children};
}