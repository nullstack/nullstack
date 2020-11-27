import {proxyConfigurable} from './configurable';

const secrets = {};

export default proxyConfigurable(secrets, 'SECRETS');