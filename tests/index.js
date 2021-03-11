if(typeof process !== 'undefined') {
  process.env.NULLSTACK_SECRETS_KEY = 'secrets';
  process.env.NULLSTACK_SECRETS_CAMELIZED_KEY = 'secrets';
  process.env.NULLSTACK_SETTINGS_KEY = 'settings';
  process.env.NULLSTACK_SETTINGS_CAMELIZED_KEY = 'settings';
}

import Nullstack from 'nullstack';
import Application from './src/Application';

import Vueable from './src/plugins/vueable';

// testing not using same
Nullstack.use([Vueable], Vueable);

Nullstack.start(Application);