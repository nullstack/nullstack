

import context from './context';
import server from './server';
import registry from './registry';
import generator from './generator';
import element from '../shared/element';
import project from './project';
import environment from './environment';
import settings, {loadSettings} from './settings';
import secrets, {loadSecrets} from './secrets';
import {freezeConfigurable} from './configurable';
import worker from './worker';
import invoke from './invoke';
import contextualize from './contextualize';

context.server = server;
context.project = project;
context.environment = environment;
context.settings = settings;
context.secrets = secrets;
context.worker = worker;

class Nullstack {

  static registry = registry;
  static element = element;
  static invoke = invoke;

  static async start(Starter) {
    if(this.name.indexOf('Nullstack') > -1) {
      generator.starter = () => element(Starter);
      loadSettings();
      loadSecrets();
      typeof(Starter.start) === 'function' && await Starter.start(context);
      freezeConfigurable(settings);
      freezeConfigurable(secrets);
      Object.freeze(worker);
      Object.freeze(project);
      server.start();
    }
  }

  _self = {
    prerendered: true,
    initiated: false,
    hydrated: false
  }

  constructor(scope) {
    this._request = () => scope.request;
    this._response = () => scope.response;
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for(const method of methods) {
      if(method !== 'constructor' && typeof(this[method]) === 'function' && !this[method].name.startsWith('_')) {
        this[method] = contextualize(this[method]).bind(this);
      }
    }
    return this;
  }

  toJSON() {
    const serialized = {};
    for(const name of Object.getOwnPropertyNames(this)) {
      if(typeof(this[name]) !== 'function' && !name.startsWith('_') && name !== 'attributes') {
        serialized[name] = this[name];
      }
    }
    return serialized;
  }

  render() {
    return false;
  }

}

export default Nullstack;