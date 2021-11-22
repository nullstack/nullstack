import Nullstack from 'nullstack';
import Application from './src/Application';
import vueable from './src/plugins/vueable';

Nullstack.use([vueable], vueable);

const application = Nullstack.start(Application);

application.start = function () {
  application.startValue = 2
  setTimeout(() => application.startTimedValue = 1, 1000)
}

export default application;