import Nullstack from 'nullstack';
import Application from './src/Application';

import vueable from './src/plugins/vueable';

Nullstack.use([vueable], vueable);

export default Nullstack.start(Application);