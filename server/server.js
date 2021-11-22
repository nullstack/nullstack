import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import fetch from 'node-fetch';
import path from 'path';
import deserialize from '../shared/deserialize';
import prefix from '../shared/prefix';
import { generateContext } from './context';
import environment from './environment';
import { generateFile } from './files';
import liveReload from './liveReload';
import generateManifest from './manifest';
import { prerender } from './prerender';
import printError from './printError';
import project from './project';
import registry from './registry';
import generateRobots from './robots';
import template from './template';
import worker, { generateServiceWorker } from './worker';



if (!global.fetch) {
  global.fetch = fetch;
}

const app = express();
const server = http.createServer(app);
server.port = process.env['NULLSTACK_SERVER_PORT'] || process.env['PORT'] || 5000;

for (const methodName of ['use', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put']) {
  server[methodName] = function () {
    app[methodName](...arguments);
  }
}

server.prerender = async function (originalUrl, options) {
  server.less && await server.ready;
  if (originalUrl === `/nullstack/${environment.key}/client.css`) {
    return generateFile('client.css', server)
  }
  if (originalUrl === `/nullstack/${environment.key}/client.js`) {
    return generateFile('client.js', server)
  }
  if (originalUrl === `/manifest.json`) {
    return generateManifest(server)
  }
  if (originalUrl === `/service-worker.js`) {
    return generateServiceWorker()
  }
  const request = { originalUrl }
  const scope = await prerender(request);
  const html = template(scope, options);
  return html;
}

server.start = function () {

  if (!server.less) {
    generateFile('client.css', server)
    generateFile('client.js', server)
    generateManifest(server);
    generateServiceWorker();
    generateRobots();
  }

  app.use(cors(server.cors))

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use(bodyParser.text({ limit: server.maximumPayloadSize }));

  app.get(`/nullstack/${environment.key}/:number.client.js`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/css');
    response.send(generateFile(`${request.params.number}.client.js`, server));
  });

  app.get(`/nullstack/${environment.key}/client.css`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/css');
    response.send(generateFile('client.css', server));
  });

  app.get(`/nullstack/${environment.key}/client.js`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/javascript');
    response.send(generateFile('client.js', server));
  });

  app.get(`/manifest.json`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('application/manifest+json');
    response.send(generateManifest(server));
  });

  if (worker.enabled) {
    app.get(`/service-worker.js`, (request, response) => {
      response.setHeader('Cache-Control', 'max-age=31536000, immutable');
      response.contentType('text/javascript');
      response.send(generateServiceWorker());
    });
  }

  app.get('/robots.txt', (request, response) => {
    response.send(generateRobots());
  });

  app.post(`/${prefix}/:hash/:methodName.json`, async (request, response) => {
    server.less && await server.ready;
    const args = deserialize(request.body);
    const { hash, methodName } = request.params;
    const [invokerHash, boundHash] = hash.split('-');
    const key = `${invokerHash}.${methodName}`;
    const invokerKlass = registry[invokerHash];
    let boundKlass = invokerKlass;
    if (boundHash) {
      boundKlass = registry[boundHash];
      if (!(boundKlass.prototype instanceof invokerKlass)) {
        return response.status(401).json({});
      }
    }
    const method = registry[key];
    if (method !== undefined) {
      try {
        const context = generateContext({ request, response, ...args });
        const result = await method.call(boundKlass, context);
        response.json({ result });
      } catch (error) {
        printError(error);
        response.status(500).json({});
      }
    } else {
      response.status(404).json({});
    }
  });

  app.get('*', async (request, response, next) => {
    server.less && await server.ready;
    if (request.originalUrl.split('?')[0].indexOf('.') > -1) {
      return next();
    }
    const scope = await prerender(request, response);
    if (!response.headersSent) {
      const status = scope.context.page.status;
      const html = template(scope);
      response.status(status).send(html);
    }
  });

  if (!server.less) {
    server.listen(server.port, () => {
      const name = project.name ? project.name : 'Nullstack'
      if (environment.development) {
        liveReload(server);
        console.log('\x1b[36m%s\x1b[0m', ` ✅️ ${name} is ready at http://localhost:${server.port}\n`);
      } else {
        console.log('\x1b[36m%s\x1b[0m', ` ✅️ ${name} is ready at http://127.0.0.1:${server.port}\n`);
      }
    });
  }

}

export default server;