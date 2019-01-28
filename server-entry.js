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

const app = express();

const port = 3769;

app.use(cors());
app.use(bodyParser.json());

const routes = [];

const settings = {};

export function config(key, value) {
  settings[key] = value;
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
  const store = new MongoDBStore({
    db: database
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

  app.use(express.static('../../../../../public'));

  app.get('/client.css', (request, response) => {
    response.sendFile('client.css', {root: '../../../../../build'});
  });

  app.get('/client.js', (request, response) => {
    response.sendFile('client.js', {root: '../../../../../build'});
  });

  app.get('*', async (request, response) => {
    try {
      let {page, params} = getPageWithParamsFromPath(routes, request.url);
      if(page) {
        const element = new page();
        element.database = database;
        element.session = request.session;
        element.props = Object.assign({}, page.defaultProps, params);
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
            this.session = request.body.session;
            this.database = database;
          }
        }
        const current = React.createElement(Klass, params);
        const elementString = ReactDOMServer.renderToString(current);
        response.send(template(elementString, element.settings, element.state));
      }
    } catch(e) {
      console.log(e);
      response.send(JSON.stringify(e));
    }
  });

  app.post('*', async (request, response) => {
    let {page, params} = getPageWithParamsFromPath(routes, request.url);
    let element = new page();
    element.database = database;
    element.state = request.body.state;
    element.settings = request.body.settings;
    element.session = request.session;
    element.props = Object.assign({}, page.defaultProps, params);
    const returned = await element[request.body.method].apply(element, request.body.params);
    response.json({
      state: element.state,
      returned: returned,
      settings: element.settings,
      redirect: element._redirect
    });
    element._redirect = null;
    //databaseClient.close();
  });

  app.listen(settings['server.port'], () => console.log(`Server is running on port ${settings['server.port']}!`));

}
