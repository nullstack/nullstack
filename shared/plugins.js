import Routable from '../plugins/routable';
import Bindable from '../plugins/bindable';
import Datable from '../plugins/datable';
import Parameterizable from '../plugins/parameterizable';
import Anchorable from '../plugins/anchorable';
import Objectable from '../plugins/objectable';

let plugins = [
  Objectable,
  Parameterizable,
  Anchorable,
  Routable,
  Datable,
  Bindable
];

export function loadPlugins(scope) {
  for(const plugin of plugins) {
    plugin.load && plugin.load({scope})
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