import Nullstack from 'nullstack';
import Application from './src/Application';
import ContextProject from './src/ContextProject';
import ContextSecrets from './src/ContextSecrets';
import ContextSettings from './src/ContextSettings';
import ContextWorker from './src/ContextWorker';
import vueable from './src/plugins/vueable';
import ServerRequestAndResponse from './src/ServerRequestAndResponse';

Nullstack.use(vueable);

const context = Nullstack.start(Application);

const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];

context.server.get('/custom-api-before-start', (request, response) => {
  response.json({ startValue: context.startValue })
})

context.server.use('/api', (request, response, next) => {
  request.status = 200;
  if (!response.headersSent) {
    next();
  }
});

for (const method of methods) {
  context.server[method.toLowerCase()]('/api', (request, response) => {
    response.status(request.status).json({ method: request.method });
  });
}

context.startIncrementalValue = 0;

context.start = async function () {
  await ContextProject.start(context);
  await ContextSecrets.start(context);
  await ContextSettings.start(context);
  await ContextWorker.start(context);
  await ServerRequestAndResponse.start(context);
  context.startValue = true;
  context.startIncrementalValue++;
}

export default context