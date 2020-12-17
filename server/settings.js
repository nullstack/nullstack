import {proxyConfigurable} from './configurable';

const settings = {};

const {proxy, loader} = proxyConfigurable(settings, 'SETTINGS');

export const loadSettings = loader;

export default proxy;
