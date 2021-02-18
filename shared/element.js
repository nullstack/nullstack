import fragment from './fragment';

function flattenChildren(children) {
  children = [].concat.apply([], children).map((child) => {
    if(child === null || child === undefined) return false;
    return child;
  });
  return [].concat.apply([], children);
}

export default function element(type, props, ...children) {
  children = flattenChildren(children);
  if(type === 'textarea') {
    children = [children.join('')];
  }
  const attributes = {...props, children};
  if(type === 'element') {
    type = attributes.tag || fragment;
    delete attributes.tag;
  }
  if(typeof(type) === 'function' && type.render !== undefined) {
    return {type, attributes, children: null}
  }
  return {type, attributes, children};
}