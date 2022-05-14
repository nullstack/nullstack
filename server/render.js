import { isFalse } from "../shared/nodes";
import { sanitizeHtml } from "../shared/sanitizeString";

export default function render(node, scope) {

  if (isFalse(node)) {
    return "<!---->";
  }

  if (node.type === 'text') {
    return (sanitizeHtml(node.text.toString()) || ' ') + "<!--#-->";
  }

  let element = `<${node.type}`;

  for (let name in node.attributes) {
    if (!name.startsWith('on') && name !== 'html') {
      const type = typeof (node.attributes[name]);
      if (type !== 'object' && type !== 'function') {
        if (name != 'value' && node.attributes[name] === true) {
          element += ` ${name}`;
        } else if (name === 'value' || (node.attributes[name] !== false && node.attributes[name] !== null && node.attributes[name] !== undefined)) {
          element += ` ${name}="${node.attributes[name]}"`;
        }
      }
    }
  }

  const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'menuitem'].includes(node.type);
  if (selfClosing && node.children.length === 0) {
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
        const source = render(node.children[i], scope);
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