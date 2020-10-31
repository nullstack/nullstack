import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import deserialize from './deserialize';
import template from './template';
import manifest from './manifest';
import {existsSync} from 'fs';
import path from 'path';
import fetch from 'node-fetch';

if (!global.fetch) {
  global.fetch = fetch;
}

const environment = {client: false, server: true, prerendered: false};

environment.development = __dirname.indexOf('.development') > -1;
environment.production = !environment.development;

const app = express();
const server = http.createServer(app);
server.port = 5000;

const hasStyle = existsSync(path.join(__dirname, 'client.css'));

for(const methodName of ['use','set', 'delete','get','head','options','patch','post','put']) {
  server[methodName] = function() {
    app[methodName](...arguments);
  }
}

const project = {};
project.type = "website";
project.display = "standalone";
project.orientation = "portrait";
project.scope = "/";
project.root = "/";
project.favicon = "/favicon-96x96.png";
project.icons = {
  '72': '/icon-72x72.png',
  '96': '/icon-96x96.png',
  '128': '/icon-128x128.png',
  '144': '/icon-144x144.png',
  '152': '/icon-152x152.png',
  '180': '/icon-180x180.png',
  '192': '/icon-192x192.png',
  '384': '/icon-384x384.png',
  '512': '/icon-512x512.png'
};

const context = {environment, server, project};

function listen() {

  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(bodyParser.text({limit: server.maximumPayloadSize}));

  app.get('/client.css', (request, response) => {
    response.sendFile(path.join(__dirname, 'client.css'));
  });

  app.get('/client.js', (request, response) => {
    response.sendFile(path.join(__dirname, 'client.js'));
  });

  app.get('/manifest.json', (request, response) => {
    response.json(manifest(project));
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
        const html = template(renderable, hasStyle);
        response.send(html);
      }
    } else {
      response.status(404).send('');
    }
  });

  server.listen(context.server.port, () => {
    const name = context.project.name ? context.project.name : 'Nullstack'
    if(environment.development) {
      console.log('\x1b[36m%s\x1b[0m', `${name} is running in development mode at http://localhost:${context.server.port}`);
    } else {
      console.log('\x1b[36m%s\x1b[0m', `${name} is running in production mode at http://127.0.0.1:${context.server.port}`);
    }
  });

}

class Router {

  constructor(scope) {
    this.scope = scope;
  }

  _redirect(target) {
    if(!this.scope.response.headersSent) {
      this.scope.response.redirect(target);
    }
  }

  get url() {
    return this.scope.request.originalUrl;
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return this.scope.request.path;
  }

  set path(target) {
    const search = this.scope.request.originalUrl.split('?')[1];
    if(search) {
      this._redirect(target+'?'+search);
    } else {
      this._redirect(target);
    }
  }

  toJSON() {
    return {
      url: this.scope.request.originalUrl,
      path: this.scope.request.path
    }
  }

}

const contextProxyHandler = {
  set(target, name, value) {
    context[name] = value;
    return Reflect.set(...arguments);
  }
}


const paramsProxyHandler = {
  get(target, name) {
    return target[name] || '';
  }
}

const instanceProxyHandler = {
  get(target, name) {
    if(target.attributes && target.attributes.proxy && target.attributes.proxy[name] !== undefined && target[name] !== undefined) {
      return target.attributes.proxy[name];
    }
    if(name !== 'prepare' && name !== 'initiate' && target[name] === undefined && typeof(target.constructor[name]) === 'function') {
      const detour = async function(params = {}) {
        const request = target._request();
        const response = target._response();
        const context = Nullstack.generateContext({request, response, ...params});
        return await target.constructor[name](context);
      }
      target[name] = detour;
    }
    return Reflect.get(...arguments);
  },
  set(target, name, value) {
    if(target.attributes && target.attributes.proxy && target.attributes.proxy[name] !== undefined && target[name] !== undefined) {
      target.attributes.proxy[name] = value;
    }
    const result = Reflect.set(...arguments);
    return result;
  }
}

class Nullstack {

  render() {
    return false;
  }

  static async start(Starter) {
    if(this.name === 'Nullstack') {
      Nullstack.generator = () => Nullstack.element(Starter);
      Nullstack.selector = '#application';
      typeof(Starter.start) === 'function' && await Starter.start(context);
      listen();
    }
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
    if(type === 'textarea') {
      children = [children.join('')];
    }
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
    const page = {image: '/image-1200x630.png'};
    const clientEnvironment = {...environment, prerendered: true};
    const clientContext = {page, project, environment: clientEnvironment};
    const clientContextProxyHandler = {
      set(target, name, value) {
        clientContext[name] = value;
        return Reflect.set(...arguments);
      }
    }
    const instances = {};
    const routes = {};
    const scope = {instances, request, routes, response};
    const [path, query] = request.originalUrl.split('?');
    scope.params = this.getQueryStringParams(query);
    scope.generateContext = (temporary) => {
      const params = temporary.params ? {...temporary.params, ...clientContext.params} : clientContext.params;
      temporary.params = new Proxy(params, paramsProxyHandler);
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
    return {html, memory, representation: virtualDom, context: clientContext, page, project, environment: clientEnvironment};
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
    return value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
  }

  static routeMatches(url, route) {
    let [path, query] = url.split('?');
    const urlPaths = path.split('/');
    const routePaths = route.split('/');
    const params = {};
    const length = Math.max(urlPaths.length, routePaths.length);
    let catchall = false;
    for(let i = 0; i < length; i++) {
      if(catchall) {
        continue;
      } else if (routePaths[i] === '*') {
        catchall = true;
      } else if (routePaths[i] && routePaths[i].startsWith(':')) {
        const key = routePaths[i].replace(':', '')
        params[key] = this.extractParamValue(urlPaths[i]);
      } else if (routePaths[i] !== urlPaths[i]) {
        return false;
      }
    }
    return params;
  }

  static isFalse(node) {
    return (node === false || node.type === false);
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
    if(node !== undefined && node.attributes != undefined && node.attributes.bind) {
      const instance = scope.findParentInstance(depth);
      const target = node.attributes.source || instance;
      if(node.type === 'textarea') {
        node.children = [target[node.attributes.bind]];
      } else if(node.type === 'input' && node.attributes.type === 'checkbox') {
        node.attributes.checked = target[node.attributes.bind];
      } else {
        node.attributes.value = target[node.attributes.bind];
      }
      node.attributes.name = node.attributes.bind;
    }
    if(node && typeof(node.type) === 'function') {
      node.attributes.params = scope.params;
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
        node.attributes.params = {...node.attributes.params, ...params};
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
      const root = node.type(context);
      node.children = [root];
      return await this.render(node.children[0], [...depth, 0], scope);
    } else if (this.isClass(node)) {
      const key = this.generateKey(node, depth);
      const instance = new node.type(scope);
      instance.attributes = node.attributes;
      scope.instances[key] = instance;
      const context = scope.generateContext(node.attributes);
      instance.prepare && instance.prepare(context);
      instance.initiate && await instance.initiate(context);
      const root = instance.render(context);
      node.children = [root];
      node.type = node.type.name;
      return await this.render(node.children[0], [...depth, 0], scope);
    } else {
      let element = `<${node.type}`;
      for(let name in node.attributes) {
        if(!name.startsWith('on') && name !== 'html' && typeof(node.attributes[name]) != 'object') {
          if(name != 'value' && node.attributes[name] === true) {
            element += ` ${name}="${name}"`;
          } else if(name == 'value' || (node.attributes[name] !== false && node.attributes[name] !== null && node.attributes[name] !== undefined)) {
            element += ` ${name}="${node.attributes[name]}"`;
          }
        }
      }
      const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'menuitem'].includes(node.type);
      if(selfClosing && node.children.length === 0) {
        element += '/>';
      } else {
        element += '>';
        if(node.attributes.html) {
          element += node.attributes.html;
        } else if(node.type === 'textarea') {
          element += node.children[0];
        } else {
          for(let i = 0; i < node.children.length; i++) {
            element += await this.render(node.children[i], [...depth, i], scope);
          }
        }
        element += `</${node.type}>`;
      }
      return element;
    }
  }

}

export default Nullstack;