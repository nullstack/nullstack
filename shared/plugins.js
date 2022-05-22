import routable from '../plugins/routable';
import bindable from '../plugins/bindable';
import datable from '../plugins/datable';
import parameterizable from '../plugins/parameterizable';
import anchorable from '../plugins/anchorable';

const plugins = [
  parameterizable,
  anchorable,
  routable,
  datable,
  bindable
];

export function transformNodes(scope, node, depth) {
  for (const plugin of plugins) {
    plugin.transform({ ...scope.context, node, depth });
  }
}

export function transformBody(attributes) {
  for (const plugin of plugins) {
    plugin.transformBody && plugin.transformBody(attributes);
  }
}

export function loadPlugins(scope) {
  for (const plugin of plugins) {
    plugin.load && plugin.load(scope.context)
  }
  return plugins;
}

export function useClientPlugins(plugin) {
  if (plugin.client) plugins.push(plugin)
}

export function useServerPlugins(plugin) {
  if (plugin.server) plugins.push(plugin)
}