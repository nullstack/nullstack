import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import fetch from 'node-fetch';
import path from 'path';
import deserialize from '../shared/deserialize';
import prefix from '../shared/prefix';
import context, { generateContext } from './context';
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
import { generateServiceWorker } from './worker';

if (!global.fetch) {
  global.fetch = fetch;
}

const app = express();
const server = http.createServer(app);

server.port ??= process.env['NULLSTACK_SERVER_PORT'] || process.env['PORT'];

let contextStarted = false
let serverStarted = false

app.use(async (request, response, next) => {
  if (!contextStarted) {
    typeof context.start === 'function' && await context.start();
    contextStarted = true;
  }
  next()
})

for (const methodName of ['use', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put']) {
  server[methodName] = function () {
    app[methodName](...arguments);
  }
}

function createRequest(path) {
  return {
    method: "GET",
    host: "",
    cookies: {},
    query: {},
    url: path,
    headers: {},
  }
}

function createResponse(callback) {
  const res = {
    _removedHeader: {},
    _statusCode: 200,
    statusMessage: 'OK',
    get statusCode() {
      return this._statusCode
    },
    set statusCode(status) {
      this._statusCode = status
      this.status(status)
    }
  };
  const headers = {};
  let code = 200;
  res.set = res.header = (x, y) => {
    if (arguments.length === 2) {
      res.setHeader(x, y);
    } else {
      for (const key in x) {
        res.setHeader(key, x[key]);
      }
    }
    return res;
  }
  res.setHeader = (x, y) => {
    headers[x] = y;
    headers[x.toLowerCase()] = y;
    return res;
  };
  res.getHeader = (x) => headers[x];
  res.redirect = function (_code, url) {
    if (typeof (_code) !== 'number') {
      code = 301;
      url = _code;
    } else {
      code = _code;
    }
    res.setHeader("Location", url);
    res.end();
  };
  res.status = res.sendStatus = function (number) {
    code = number;
    return res;
  };
  res.end = res.send = res.write = function (data) {
    if (callback) callback(code, data, headers);
  };
  return res;
}

server.prerender = async function (originalUrl, options) {
  server.start()
  return new Promise((resolve, reject) => {
    app._router.handle(
      createRequest(originalUrl),
      createResponse((code, data, headers) => resolve(data)),
      () => { }
    )
  })
}

server.start = function () {

  if (serverStarted) return;
  serverStarted = true;

  app.use(cors(server.cors));

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use(bodyParser.text({ limit: server.maximumPayloadSize }));

  app.get(`/:number.client.js`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/css');
    response.send(generateFile(`${request.params.number}.client.js`, server));
  });

  app.get(`/client.css`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/css');
    response.send(generateFile('client.css', server));
  });

  app.get(`/client.js`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/javascript');
    response.send(generateFile('client.js', server));
  });

  app.get(`/manifest.json`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('application/manifest+json');
    response.send(generateManifest(server));
  });

  app.get(`/service-worker.js`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/javascript');
    response.send(generateServiceWorker());
  });

  app.get('/robots.txt', (request, response) => {
    response.send(generateRobots());
  });

  app.all(`/${prefix}/:hash/:methodName.json`, async (request, response) => {
    const payload = request.method === 'GET' ? request.query.payload : request.body;
    const args = deserialize(payload);
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
    if (!server.port) {
      console.log('\x1b[31mServer port is not defined!\x1b[0m');
      process.exit();
    }
  
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