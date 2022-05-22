import { isFalse } from '../shared/nodes';
import { anchorableElement } from './anchorableNode';
import client from './client';

let pool = []

function hydrateBody(selector, node) {
  if (node?.attributes?.html) {
    anchorableElement(selector);
  }
  node.element = selector
  for (const element of selector.childNodes) {
    if ((element.tagName === 'TEXTAREA' || element.tagName === 'textarea') && element.childNodes.length === 0) {
      element.appendChild(document.createTextNode(''));
    } else if (element.COMMENT_NODE === 8 && element.textContent === '#') {
      pool.push(element.remove())
    }
  }
  if (!node.children) return
  const limit = node.children.length;
  for (let i = limit - 1; i > -1; i--) {
    if (node.type !== 'head' && typeof selector?.childNodes?.[i] === 'undefined') {
      console.error(
        `${node.type.toUpperCase()} expected tag ${node.children[i].type.toUpperCase()} to be child at index ${i} but instead found undefined. This error usually happens because of an invalid HTML hierarchy or changes in comparisons after serialization.`,
        selector
      )
      throw new Error('Virtual DOM does not match the DOM.')
    }
    hydrateBody(selector.childNodes[i], node.children[i])
  }
}

function hydrateHead() {
  for (const node of client.nextHead) {
    if (isFalse(node)) {
      node.element = pool.pop() || document.createComment("")
      client.head.append(node.element)
    } else {
      node.element = document.getElementById(node.attributes.id)
    }
  }
  pool = null
}

export default function hydrate(selector, node) {
  hydrateBody(selector, node)
  hydrateHead()
}