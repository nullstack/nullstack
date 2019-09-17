import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoSession from 'connect-mongodb-session';
import {MongoClient} from 'mongodb';
import {getPageWithParamsFromPath} from './router';
import React from "react";
import ReactDOMServer from 'react-dom/server';
import template from './template';
import multer from 'multer';
import storage from './storage';

const app = express();

const port = 3769;

app.use(cors());

const routes = [];

const settings = {};

export function config(key, value) {
  if(value) {
    settings[key] = value;
  } else {
    return settings[key];
  }
}

export function route(path, page) {
  routes.push({path: path, page: page});
}

export function getSettings() {
  let defaults = {};
  Object.keys(settings).forEach((key) => {
    if(key.startsWith('default')) {
      defaults[key.split('.')[1]] = settings[key];
    }
  });
  return defaults;
}

export async function ready() {

  const databaseClient = new MongoClient(settings['database.url']);

  const MongoDBStore = mongoSession(session);

  await databaseClient.connect();
  const database = await databaseClient.db(settings['database.name']);

  var store = new MongoDBStore({
    uri: settings['database.url'],
    databaseName: settings['database.name'],
    collection: 'sessions'
  });

  app.use(session({
    secret: settings['session.secret'],
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: {
       maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
  }));

  const upload = multer({ storage: multer.memoryStorage() });

  app.use(express.static('NULLSTACK_ROOT/public'));
  app.use('/uploads', express.static('NULLSTACK_ROOT/uploads'));

  app.get('/client.css', (request, response) => {
    response.sendFile('client.css', {root: 'NULLSTACK_ROOT/NULLSTACK_FOLDER'});
  });

  app.get('/client.js', (request, response) => {
    response.sendFile('client.js', {root: 'NULLSTACK_ROOT/NULLSTACK_FOLDER'});
  });

  app.get('*', async (request, response) => {
    try {
      let {page, params} = getPageWithParamsFromPath(routes, request.url);
      if(page) {
        const element = new page();
        element.database = database;
        element.session = request.session;
        element.props = Object.assign({}, page.defaultProps, params);
        element.request = request;
        element.resetState();
        await element.authorize();
        if(element._redirect) {
          response.redirect(element._redirect);
        }
        if(element.historyDidUpdate) {
          await element.historyDidUpdate();
        }
        if(element._redirect) {
          response.redirect(element._redirect);
        }
        const Klass = class extends page {
          constructor(props) {
            super(props);
            this.state = element.state;
            this.session = element.session;
            this.database = database;
            this.request = request;
          }
        }
        const current = React.createElement(Klass, params);
        const elementString = ReactDOMServer.renderToString(current);
        response.send(template(elementString, element.settings, element.state, request));
      }
    } catch(e) {
      console.log(e);
      response.send(JSON.stringify(e));
    }
  });

  app.post('*', upload.any(), async (request, response) => {
    const paramsSize = JSON.parse(request.body.params);
    const functionParams = [];
    for (let i = 0; i < paramsSize; i++) {
      const fieldname = `param${i}`;
      if(request.body[fieldname]) {
        functionParams.push(JSON.parse(request.body[fieldname]));
      } else {
        functionParams.push(request.files.find((f) => f.fieldname == fieldname));
      }
    }
    let {page, params} = getPageWithParamsFromPath(routes, request.url);
    let element = new page();
    element.database = database;
    element.state = JSON.parse(request.body.state);
    element.settings = JSON.parse(request.body.settings);
    element.session = request.session;
    element.props = Object.assign({}, page.defaultProps, params);
    element.storage = storage;
    element.request = request;
    await element.authorize(request.body.method);
    if(element._redirect) {
      return response.json({
        schema: element.schema,
        state: element.state,
        settings: element.settings,
        redirect: element._redirect
      });
    }
    const returned = await element[request.body.method].apply(element, functionParams);
    response.json({
      schema: element.schema,
      state: element.state,
      returned: returned,
      settings: element.settings,
      redirect: element._redirect
    });
    element._redirect = null;
    //databaseClient.close();
  });

  app.listen(settings['server.port'], () => console.log(`Server is ready at http://localhost:${settings['server.port']}!`));

}
