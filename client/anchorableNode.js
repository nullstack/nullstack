import {isAnchorable} from '../shared/nodes';
import router from './router';

export function anchorableNode(node) {
  if(isAnchorable(node)) {
    const originalEvent = node.attributes.onclick;
    node.attributes.onclick = ({event}) => {
      event.preventDefault();
      router.url = node.attributes.href;
      if(originalEvent) {
        setTimeout(() => {
          originalEvent({...node.attributes, event});
        }, 0);
      }
    };
  }
}

export function anchorableElement(element) {
  const links = element.querySelectorAll('a[href^="/"]:not([target])');
  for(const link of links) {
    link.onclick = (event) => {
      event.preventDefault();
      router.url = link.getAttribute('href');
    };
  }
}