function match(node) {
  return (
    node &&
    node.attributes !== undefined &&
    (node.attributes['v-if'] !== undefined ||
    node.attributes['v-html'] !== undefined)
  )
}

function transform({ node, environment, page, project, pluginData }) {
  if (environment.server) pluginData.changedServer = true;
  if (environment.client) pluginData.changedClient = true;
  if (page && project && environment) pluginData.accessInTransform = true;

  if(!match(node)) return;

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

function load(context) {
  const { page, project, environment } = context;
  if (page && project && environment) {
    context.pluginData = { accessInLoad: true };
  }
}

export default { transform, load, client: true, server: true }