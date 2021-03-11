import environment from './environment';
import project from './project';
import Router from './router';
import generator from './generator';
import {generateParams} from './params';
import render from './render';
import settings from './settings';
import worker from './worker';
import printError from './printError';
import {generateContext} from './client';
import generateTree from '../shared/generateTree';

import Routable from '../plugins/routable';
import Bindable from '../plugins/bindable';
import Datable from '../plugins/datable';
import Parameterizable from '../plugins/parameterizable';

export async function prerender(request, response) {
  const context = {};
  context.page = {image: '/image-1200x630.png', status: 200};  
  context.project = project;
  context.environment = environment;
  context.settings = settings;
  context.params = generateParams(request.originalUrl);
  context.router = new Router(request, response);
  const online = context.router.url !== `/offline-${environment.key}`;
  context.worker = {...worker, online, responsive: online};
  const scope = {};
  scope.instances = {};
  context.instances = scope.instances;
  scope.segments = context.params;
  scope.request = request;
  scope.response = response;
  scope.head = '';
  scope.body = '';
  scope.context = context;
  scope.generateContext = generateContext(context);

  scope.plugins = [
    new Parameterizable({scope}),
    new Routable({scope}),
    new Datable({scope}),
    new Bindable({scope})
  ]

  try {
    const tree = await generateTree(generator.starter(), scope);
    scope.body = render(tree, scope);
    if(!online) {
      context.page.status = 200;
    }
  } catch(error) {
    printError(error);
    context.page.status = 500;
  } finally {
    if(context.page.status !== 200) {
      for(const key in scope.routes) {
        delete scope.routes[key];
      }
      for(const key in scope.instances) {
        delete scope.instances[key];
      }
      scope.head = '';
      scope.plugins = [
        new Parameterizable({scope}),
        new Routable({scope}),
        new Datable({scope}),
        new Bindable({scope})
      ]
      const tree = await generateTree(generator.starter(), scope);
      scope.body = render(tree, scope);
    }
  }
  return scope;
}