export default class Vueable {

  match({ node }) {
    return (
      node &&
      node.attributes !== undefined &&
      (node.attributes['v-if'] !== undefined ||
      node.attributes['v-html'] !== undefined)
    )
  }

  transform({ node }) {
    const attributes = node.attributes;

    if (attributes['v-if'] === false) {
      node.type = false;
      delete node.attributes;
      delete node.children;
      return;
    }

    if (attributes['v-html']) {
      node.attributes.html = attributes['v-html'];
    }

    delete node.attributes['v-if'];
    delete node.attributes['v-html'];
  }

}