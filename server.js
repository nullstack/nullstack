import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import deserialize from './deserialize';
import template from './template';

const environment = {client: false, server: true, prerendered: false};

environment.development = process.argv[1].indexOf('.development') > -1;
environment.production = process.argv[1].indexOf('.production') > -1;

const root = environment.development ? '.development' : '.production';

const app = express();
const server = http.createServer(app);

for(const methodName of ['use','set', 'delete','get','head','options','patch','post','put']) {
  server[methodName] = function() {
    app[methodName](...arguments);
  }
}

const context = {environment, server, port: 5000};

function listen() {
  
  app.use(express.static('public'));
  app.use(bodyParser.text());

  app.get('/client.css', (request, response) => {
    response.sendFile('client.css', {root});
  });

  app.get('/client.js', (request, response) => {
    response.sendFile('client.js', {root});
  });

  app.post("/:klassName/:methodName.json", async (request, response) => {
    const args = deserialize(request.body);
    const {klassName, methodName} = request.params;
    const key = `${klassName}.${methodName}`;
    const method = Nullstack.registry[key];
    if(method !== undefined) {
      const context = Nullstack.generateContext({request, response, ...args});
      const result = await method(context);
      response.json({result});
    } else {
      response.status(404).json({});
    }
  });

  app.get("*", async (request, response) => {
    if(request.originalUrl.indexOf('.') === -1) {
      const renderable = await Nullstack.prerender(request, response);
      if(!response.headersSent) {
        const html = template(renderable);
        response.send(html);
      }
    } else {
      response.status(404).send('');
    }
  });

  server.listen(context.port, () => {
    if(environment.development) {
      console.log(`Nullstack is running in development mode at http://localhost:${context.port}`);
    } else {
      console.log(`Nullstack is running in production mode at http://127.0.0.1:${context.port}`);
    }
  });

}

class Router {

  constructor(scope) {
    this.scope = scope;
  }

  get url() {
    return this.scope.request.originalUrl;
  }

  set url(target) {
    if(!this.scope.response.headersSent) {
      this.scope.response.redirect(target);
    }
  }

}

const contextProxyHandler = {
  set(target, name, value) {
    context[name] = value;
    return Reflect.set(...arguments);
  }
}

const instanceProxyHandler = {
  get(target, name) {
    if(name !== 'initialize' && name !== 'initiate' && target[name] === undefined && typeof(target.constructor[name]) === 'function') {
      const detour = async function(params = {}) {
        const request = target._request();
        const response = target._response();
        const context = Nullstack.generateContext({request, response, ...params});
        return await target.constructor[name](context);
      }
      target[name] = detour;
    }
    return Reflect.get(...arguments);
  }
}

class Nullstack {

  static async initialize(selector='#application') {
    const Starter = this;
    Nullstack.generator = () => <Starter />;
    Nullstack.selector = selector;
    typeof(Starter.initiate) === 'function' && await Starter.initiate(context);
    listen();
  }

  serialize() {
    const serialized = {};
    for(const name of Object.getOwnPropertyNames(this)) {
      if(typeof(this[name]) !== 'function') {
        serialized[name] = this[name];
      }
    }
    return serialized;
  }

  static generateContext(temporary) {
    return new Proxy({...context, ...temporary}, contextProxyHandler);
  }

  static generateKey(node, depth) {
    return depth.join('.');
  }

  static registry = {};

  static generator = null;
  static selector = null;

  static flattenChildren(children) {
    children = [].concat.apply([], children).map((child) => {
      if(child === null || child === undefined) return false;
      if(child.type === 'Fragment') return this.flattenChildren(child.children);
      return child;
    });
    return [].concat.apply([], children);
  }

  static element(type, attributes = {}, ...children) {
    if(attributes === null) {
      attributes = {};
    }
    children = this.flattenChildren(children);
    if(typeof(type) === 'function' && type.render !== undefined) {
      return {type, attributes, children: null}
    }
    return {type, attributes, children};
  }

  constructor(scope) {
    this._request = () => scope.request;
    this._response = () => scope.response;
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    const proxy = new Proxy(this, instanceProxyHandler);
    for(const method of methods) {
      if(method !== '_request' && method !== '_response' && method !== 'constructor' && typeof(this[method]) === 'function') {
        this[method] = this[method].bind(proxy);
      }
    }
    return proxy;
  }

  static async prerender(request, response) {
    const metadata = {};
    const clientEnvironment = {...environment, prerender: true};
    const clientContext = {metadata, environment: clientEnvironment};
    const clientContextProxyHandler = {
      set(target, name, value) {
        clientContext[name] = value;
        return Reflect.set(...arguments);
      }
    }
    const instances = {};
    const routes = {};
    const scope = {instances, request, routes, response};
    scope.generateContext = (temporary) => {
      return new Proxy({...clientContext, ...temporary}, clientContextProxyHandler);
    }
    scope.findParentInstance = (depth) => {
      for(let i = 0; i < depth.length; i++) {
        const key = depth.slice(0, i * -1).join('.');
        if(scope.instances[key]) {
          return scope.instances[key];
        }
      }
    }
    clientContext.router = new Router(scope);
    const virtualDom = this.generator();
    const html = await this.render(virtualDom, [0], scope);
    const memory = {};
    for(const key in scope.instances) {
      memory[key] = scope.instances[key].serialize();
    }
    return {html, memory, representation: virtualDom, context: clientContext, metadata};
  }

  static getQueryStringParams(query) {
    if(query) {
      query = (/^[?#]/.test(query) ? query.slice(1) : query);
      return query.split('&').reduce((params, param) => {
        let [key, value] = param.split('=');
        params[key] = this.extractParamValue(value);
        return params;
      }, {});
    } else {
      return {};
    }
  };

  static extractParamValue(value) {
    if(value === 'true') return true;
    if (value === 'false') return false;
    if(/^\d+$/.test(value)) return parseInt(value);
    return value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
  }

  static routeMatches(url, route) {
    let [path, query] = url.split('?');
    if(route === '*') return this.getQueryStringParams(query);
    const urlPaths = path.split('/');
    const routePaths = route.split('/');
    if(routePaths.length != urlPaths.length) return false;
    const params = {};
    for(let i = 0; i < routePaths.length; i++) {
      if(routePaths[i].startsWith(':')) {
        const key = routePaths[i].replace(':', '')
        params[key] = this.extractParamValue(urlPaths[i]);
      } else if(routePaths[i] !== urlPaths[i]) {
        return false;
      }
    }
    return {...params, ...this.getQueryStringParams(query)};
  }

  static isClass(node) {
    return typeof(node.type) === 'function' && typeof(node.type.prototype.render === 'function');
  }

  static isFunction(node) {
    return typeof(node.type) === 'function' && node.type.prototype === undefined;
  }

  static async render(node, depth, scope) {
    if(node.type === 'Fragment') {
      let element = '';
      for(let i = 0; i < node.children.length; i++) {
        element += await this.render(node.children[i], [...depth, i], scope);
      }
      return element;
    }
    if(node === false || (node !== undefined && node.type === false)) {
      return "<!-- -->";
    }
    if(node !== undefined && node.attributes !== undefined && node.attributes.route !== undefined) {
      const routeDepth = depth.slice(0,-1).join('.');
      if(scope.routes[routeDepth] !== undefined) {
        node.type = false;
        node.children = [];
        return await this.render(node, depth, scope);
      }
      const url = scope.request.originalUrl;
      const params = this.routeMatches(url, node.attributes.route);
      if(params) {
        scope.routes[routeDepth] = true;
        node.attributes.params = params;
      } else {
        node.type = false;
        node.children = [];
        return await this.render(node, depth, scope);
      }
    }
    if(node === undefined || node.type === undefined) {
      return node + "<!--#-->";
    } else if (this.isFunction(node)) {
      const instance = scope.findParentInstance(depth);
      const context = scope.generateContext({...instance.attributes, ...node.attributes});
      node.children = [node.type(context)];
      return await this.render(node.children[0], [...depth, 0], scope);
    } else if (this.isClass(node)) {
      const key = this.generateKey(node, depth);
      const instance = new node.type(scope);
      //instance.server = {request: scope.request, response: scope.response};
      instance.attributes = node.attributes;
      scope.instances[key] = instance;
      const context = scope.generateContext(node.attributes);
      instance.initialize && instance.initialize(context);
      instance.initiate && await instance.initiate(context);
      node.children = [instance.render.call(instance, context)];
      node.type = node.type.name;
      return await this.render(node.children[0], [...depth, 0], scope);
    } else {
      let element = `<${node.type}`;
      for(let name in node.attributes) {
        if(!name.startsWith('on')) {
          if(node.attributes[name] === true) {
            element += ` ${name}="${name}"`;
          } else if(node.attributes[name] !== false) {
            element += ` ${name}="${node.attributes[name]}"`;
          }
        }
      }
      if(node.children.length > 0) {
        element += '>';
        for(let i = 0; i < node.children.length; i++) {
          element += await this.render(node.children[i], [...depth, i], scope);
        }
        element += `</${node.type}>`;
      } else {
        element += '/>';
      }
      return element;
    }
  }

}

export default Nullstack;