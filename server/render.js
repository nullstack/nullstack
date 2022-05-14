import { isFalse } from "../shared/nodes";
import { sanitizeHtml } from "../shared/sanitizeString";

function isSelfClosing(type) {
  if (type === 'input') return true;
  if (type === 'img') return true;
  if (type === 'link') return true;
  if (type === 'meta') return true;
  if (type === 'br') return true;
  if (type === 'hr') return true;
  if (type === 'area') return true;
  if (type === 'base') return true;
  if (type === 'col') return true;
  if (type === 'embed') return true;
  if (type === 'param') return true;
  if (type === 'source') return true;
  if (type === 'track') return true;
  if (type === 'wbr') return true;
  if (type === 'menuitem') return true;
  return false;
}

export default function render(node, scope, next) {

  if (isFalse(node)) {
    return "<!---->";
  }

  if (node.type === 'text') {
    const text = node.text === '' ? ' ' : sanitizeHtml(node.text.toString())
    return next && next.type === 'text' ? text + "<!--#-->" : text
  }

  let element = `<${node.type}`;

  for (let name in node.attributes) {
    if (!name.startsWith('on') && name !== 'html') {
      const type = typeof node.attributes[name];
      if (type !== 'object' && type !== 'function') {
        if (name != 'value' && node.attributes[name] === true) {
          element += ` ${name}`;
        } else if (name === 'value' || (node.attributes[name] !== false && node.attributes[name] !== null && node.attributes[name] !== undefined)) {
          element += ` ${name}="${node.attributes[name]}"`;
        }
      }
    }
  }

  if (isSelfClosing(node.type)) {
    element += '/>';
  } else {
    element += '>';
    if (node.attributes.html) {
      const source = node.attributes.html;
      if (node.type === 'head') {
        scope.head += source;
      } else {
        element += source;
      }
    } else if (node.type === 'textarea') {
      element += node.children[0].text;
    } else {
      for (let i = 0; i < node.children.length; i++) {
        const source = render(node.children[i], scope, node.children[i + 1]);
        if (node.type === 'head') {
          scope.head += source;
        } else {
          element += source;
        }
      }
    }
    element += `</${node.type}>`;
  }

  return node.type === 'head' ? '<!---->' : element;
}