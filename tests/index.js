if(typeof process !== 'undefined') {
  process.env.NULLSTACK_SECRETS_KEY = 'secrets';
  process.env.NULLSTACK_SECRETS_CAMELIZED_KEY = 'secrets';
  process.env.NULLSTACK_SETTINGS_KEY = 'settings';
  process.env.NULLSTACK_SETTINGS_CAMELIZED_KEY = 'settings';
}

import Nullstack from 'nullstack';
import Application from './src/Application';

import vueable from './src/plugins/vueable';

Nullstack.use([vueable], vueable);

Nullstack.start(Application);