import routable from '../plugins/routable';
import bindable from '../plugins/bindable';
import datable from '../plugins/datable';
import parameterizable from '../plugins/parameterizable';
import anchorable from '../plugins/anchorable';
import objectable from '../plugins/objectable';

let plugins = [
  objectable,
  parameterizable,
  anchorable,
  routable,
  datable,
  bindable
];

export function transformNodes(scope, node, depth) {
  for(const plugin of plugins) {
    plugin.transform({...scope.context, node, depth});
  }
}

export function loadPlugins(scope) {
  for(const plugin of plugins) {
    plugin.load && plugin.load(scope.context)
  }
  return plugins;
}

export function usePlugins(environment) {
  return async (...userPlugins) => {
    plugins = [
      ...new Set([...userPlugins.flat(), ...plugins])
    ].filter((plugin) => plugin[environment])
  }
}