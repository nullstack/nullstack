import Nullstack from 'nullstack';
import Application from './src/Application';
import vueable from './src/plugins/vueable';

Nullstack.use([vueable], vueable);

const context = Nullstack.start(Application);

context.start = function () {
  context.startValue = 2
  setTimeout(() => context.startTimedValue = 1, 1000)
}

export default context;