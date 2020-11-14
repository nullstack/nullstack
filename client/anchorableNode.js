import {isAnchorable} from '../shared/nodes';
import environment from './environment';
import router from './router';

export function anchorableNode(node) {
  if(isAnchorable(node)) {
    node.attributes.onclick = ({event}) => {
      event.preventDefault();
      router.url = node.attributes.href;
      environment.prerendered = false;
    };
  }
}

export function anchorableElement(element) {
  const links = element.querySelectorAll('a[href^="/"]:not([target])');
  for(const link of links) {
    link.onclick = (event) => {
      event.preventDefault();
      router.url = link.href;
      environment.prerendered = false;
    };
  }
}