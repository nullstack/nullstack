import {proxyConfigurable} from './configurable';

const secrets = {};

const {proxy, loader} = proxyConfigurable(secrets, 'SECRETS');

export const loadSecrets = loader;

export default proxy;
