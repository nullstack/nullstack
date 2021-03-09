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

export function instantiatePlugins(scope) {
  return plugins.map(p => new p({ scope }));
}

export function usePlugins(environment) {
  return async (...userPlugins) => {
    plugins = [
      ...new Set([...userPlugins.flat(), ...plugins])
    ].filter((plugin) => plugin[environment])
  }
}