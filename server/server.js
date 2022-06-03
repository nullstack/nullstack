import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import deserialize from '../shared/deserialize';
import prefix from '../shared/prefix';
import context, { generateContext } from './context';
import environment from './environment';
import { generateFile } from './files';
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

const server = express();
const router = new express.Router()
server.nullstackRouter = router

server.port ??= process.env['NULLSTACK_SERVER_PORT'] || process.env['PORT'] || 3000

let contextStarted = false
let serverStarted = false

router.use(async (request, response, next) => {
  if (!contextStarted) {
    typeof context.start === 'function' && await context.start();
    contextStarted = true;
  }
  next()
})

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
    if (typeof _code !== 'number') {
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
    server._router.handle(
      createRequest(originalUrl),
      createResponse((code, data, headers) => resolve(data)),
      () => { }
    )
  })
}

server.start = function () {

  if (serverStarted) return;
  serverStarted = true;

  router.use(cors(server.cors));

  router.use(express.static(path.join(__dirname, '..', 'public')));

  router.use(bodyParser.text({ limit: server.maximumPayloadSize }));

  server.get(`/:number.client.js`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/javascript');
    response.send(generateFile(`${request.params.number}.client.js`, server));
  });

  server.get(`/:number.client.css`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/css');
    response.send(generateFile(`${request.params.number}.client.css`, server));
  });

  server.get(`/client.css`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/css');
    response.send(generateFile('client.css', server));
  });

  server.get(`/client.js`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/javascript');
    response.send(generateFile('client.js', server));
  });

  router.get(`/manifest.webmanifest`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('application/manifest+json');
    response.send(generateManifest(server));
  });

  router.get(`/service-worker.js`, (request, response) => {
    response.setHeader('Cache-Control', 'max-age=31536000, immutable');
    response.contentType('text/javascript');
    response.send(generateServiceWorker());
  });

  router.get('/robots.txt', (request, response) => {
    response.send(generateRobots());
  });

  router.all(`/${prefix}/:hash/:methodName.json`, async (request, response) => {
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

  router.get('*', async (request, response, next) => {
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

  server.use(router)

  if (!server.less) {
    if (!server.port) {
      console.log('\x1b[31mServer port is not defined!\x1b[0m');
      process.exit();
    }

    server.listen(server.port, () => {
      if (environment.production) {
        const name = project.name ? project.name : 'Nullstack'
        console.log('\x1b[36m%s\x1b[0m', ` ✅️ ${name} is ready at http://127.0.0.1:${server.port}\n`);
      }
    });
  }

}

export default server;