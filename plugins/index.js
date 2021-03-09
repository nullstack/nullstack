import Routable from './routable';
import Bindable from './bindable';
import Datable from './datable';
import Parameterizable from './parameterizable';
import Anchorable from './anchorable';
import Objectable from './objectable';

export const serverPlugins = [
  Routable,
  Bindable,
  Datable,
  Parameterizable
];

export const clientPlugins = [
  Objectable,
  Parameterizable,
  Anchorable,
  Routable,
  Datable,
  Bindable
];