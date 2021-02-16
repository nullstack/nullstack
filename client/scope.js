import context from './context';
import generateTree from '../shared/generateTree';
import rerender from './rerender';

import Routable from '../plugins/routable';
import Bindable from '../plugins/bindable';
import Datable from '../plugins/datable';
import Parameterizable from '../plugins/parameterizable';
import Anchorable from '../plugins/anchorable';
import Objectable from '../plugins/objectable';

export default class Scope {

  initialized = false;
  hydrated = false;

  initializer = null;
  
  instances = {};
  routes = {};

  updateTask = null;

  initiationQueue = [];
  renewalQueue = [];
  hydrationQueue = [];

  virtualDom = null;
  nextVirtualDom = null;

  selector = null;

  constructor() {
    this.context = context;
    this.reset = this.reset.bind(this);
    this.generateTree = this.generateTree.bind(this);
    this.update = this.update.bind(this);
    this.processLifecycleQueues = this.processLifecycleQueues.bind(this);
    this.start = this.start.bind(this);
    this.reset();
  }

  reset() {
    this.initialized = false;
    this.initiationQueue = [];
    this.renewalQueue = [];
    this.hydrationQueue = [];
  }

  async generateTree() {
    this.plugins = [
      new Objectable({scope: this}),
      new Parameterizable({scope: this}),
      new Anchorable({scope: this}),
      new Routable({scope: this}),
      new Datable({scope: this}),
      new Bindable({scope: this})
    ]
    return await generateTree(this.initializer(), this);
  }

  async start(Starter) {
    
    client.routes = {};
    updateParams(router.url);
    client.currentInstance = null;
    client.initializer = () => element(Starter);
    client.selector = document.querySelector('#application');
    client.virtualDom = await generateTree(client.initializer(), scope);
    context.environment = environment;
    scope.plugins = [
      new Objectable({scope}),
      new Parameterizable({scope}),
      new Anchorable({scope}),
      new Routable({scope}),
      new Datable({scope}),
      new Bindable({scope})
    ]
    client.nextVirtualDom = await generateTree(client.initializer(), scope);
    rerender(client.selector, []);
    client.virtualDom = client.nextVirtualDom;
    client.nextVirtualDom = null;
    client.processLifecycleQueues();
    delete window.context;
  }

  update() {
    clearInterval(this.updateTask);
    this.updateTask = setTimeout(async () => {
      this.context = context;
      this.nextVirtualDom = await this.generateTree();
      rerender(this.selector, []);
      this.virtualDom = this.nextVirtualDom;
      this.nextVirtualDom = null;
      this.processLifecycleQueues();
    }, 16);
  }

  async processLifecycleQueues() {
    if(!this.initialized) {
      this.initialized = true;
      this.hydrated = true;
    }
    const initiationQueue = this.initiationQueue;
    const hydrationQueue = this.hydrationQueue;
    for(const instance of initiationQueue) {
      instance.initiate && await instance.initiate();
      instance._self.initiated = true;
    }
    if(initiationQueue.length) {
      this.update();
    }
    for(const instance of hydrationQueue) {
      instance.hydrate && await instance.hydrate();
      instance._self.hydrated = true;
    }
    if(hydrationQueue.length) {
      this.update();
    }
    for(const key in this.instances) {
      const instance = this.instances[key];
      if(!this.renewalQueue.includes(instance)) {
        instance.terminate && await instance.terminate();
        delete this.instances[key];
      }
    }
    this.context.router._changed = false;
  }

}