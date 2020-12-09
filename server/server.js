import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import {existsSync} from 'fs';
import fetch from 'node-fetch';

import deserialize from '../shared/deserialize';
import template from './template';
import manifest from './manifest';
import {generateContext} from './context';
import project from './project';
import environment from './environment';
import registry from './registry';
import {prerender} from './prerender';

if (!global.fetch) {
  global.fetch = fetch;
}

const app = express();
const server = http.createServer(app);
server.port = 5000;

for(const methodName of ['use','set', 'delete','get','head','options','patch','post','put']) {
  server[methodName] = function() {
    app[methodName](...arguments);
  }
}

const hasStyle = existsSync(path.join(__dirname, 'client.css'));

server.start = function() {

  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(bodyParser.text({limit: server.maximumPayloadSize}));

  app.get(`/client-${environment.key}.css`, (request, response) => {
    response.sendFile(path.join(__dirname, 'client.css'));
  });

  app.get(`/client-${environment.key}.js`, (request, response) => {
    response.sendFile(path.join(__dirname, 'client.js'));
  });

  app.get('/manifest.json', (request, response) => {
    response.json(manifest(project));
  });

  app.post("/api/:klassName/:methodName.json", async (request, response) => {
    const args = deserialize(request.body);
    const {klassName, methodName} = request.params;
    const key = `${klassName}.${methodName}`;
    const method = registry[key];
    if(method !== undefined) {
      const context = generateContext({request, response, ...args});
      const result = await method(context);
      response.json({result});
    } else {
      response.status(404).json({});
    }
  });

  app.get("*", async (request, response) => {
    const renderable = await prerender(request, response);
    if(!response.headersSent) {
      const html = template(renderable, hasStyle);
      response.send(html);
    }
  });

  server.listen(server.port, () => {
    const name = project.name ? project.name : 'Nullstack'
    if(environment.development) {
      console.log('\x1b[36m%s\x1b[0m', `${name} is running in development mode at http://localhost:${server.port}`);
    } else {
      console.log('\x1b[36m%s\x1b[0m', `${name} is running in production mode at http://127.0.0.1:${server.port}`);
    }
  });

}

export default server;