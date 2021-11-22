import Nullstack from 'nullstack';
import Application from './src/Application';
import ContextProject from './src/ContextProject';
import ContextSecrets from './src/ContextSecrets';
import ContextSettings from './src/ContextSettings';
import ContextWorker from './src/ContextWorker';
import vueable from './src/plugins/vueable';
import ServerRequestAndResponse from './src/ServerRequestAndResponse';

Nullstack.use([vueable], vueable);

const context = Nullstack.start(Application);

context.start = async function () {
  await ContextProject.start(context);
  await ContextSecrets.start(context);
  await ContextSettings.start(context);
  await ContextWorker.start(context);
  await ServerRequestAndResponse.start(context);
}

export default context
