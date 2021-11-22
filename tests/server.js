import Nullstack from 'nullstack';
import Application from './src/Application';
import ContextProject from './src/ContextProject';
import ContextSecrets from './src/ContextSecrets';
import ContextSettings from './src/ContextSettings';
import ContextWorker from './src/ContextWorker';
import vueable from './src/plugins/vueable';
import ServerRequestAndResponse from './src/ServerRequestAndResponse';

Nullstack.use([vueable], vueable);

const application = Nullstack.start(Application);

application.start = async function () {
  await ContextProject.start(application);
  await ContextSecrets.start(application);
  await ContextSettings.start(application);
  await ContextWorker.start(application);
  await ServerRequestAndResponse.start(application);
}

export default application
