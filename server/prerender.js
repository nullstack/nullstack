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
  scope.routes = {};
  scope.request = request;
  scope.response = response;
  scope.head = '';
  scope.body = '';
  scope.context = context;
  scope.generateContext = generateContext(context);
  try {
    scope.body = await render(generator.starter(), [0], scope);
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
      scope.body = await render(generator.starter(), [0], scope);
    }
  }
  return scope;
}