import deserialize from './deserialize';

window.representation = deserialize(JSON.stringify(window.representation));
window.instances = deserialize(JSON.stringify(window.instances));

window.addEventListener('popstate', () => {
  Nullstack.update();
});

const pageProxyHandler = {
  set(target, name, value) {
    if(name === 'title') {
      document.title = value;
    }
    const result = Reflect.set(...arguments);
    Nullstack.update();
    return result;
  }
}

const paramsProxyHandler = {
  set(target, name, value) {
    const keys = Object.keys(target);
    if(!keys.includes(name)) {
      keys.push(name);
    }
    const search = keys.map((key) => {
      const delta = key == name ? value : target[key];
      if(delta === false || !!delta) {
        return `${key}=${delta}`;
      } else {
        return '';
      }
    }).filter((segment) => !!segment).join('&');
    context.router.url = window.location.pathname + (search ? '?' : '') + search;
    Nullstack.params = target;
    const result = Reflect.set(...arguments);
    return result;
  },
  get(target, name) {
    return target[name] || '';
  }
}

let redirectTimer = null;

class Router {

  _redirect(target) {
    clearTimeout(redirectTimer);
    redirectTimer = setTimeout(() => {
      history.pushState({}, document.title, target);
      window.dispatchEvent(new Event('popstate'));
      Nullstack.routeChanged = true;
    }, 0);
  }

  get url() {
    return window.location.pathname+window.location.search;
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return window.location.pathname;
  }

  set path(target) {
    this._redirect(target+window.location.search);
  }

}

const environment = {...window.environment, client: true, server: false};
delete window.environment;
const page = new Proxy({...window.page}, pageProxyHandler);
delete window.page;
const router = new Router();
const context = {environment, page, router};

const contextProxyHandler = {
  set(target, name, value) {
    context[name] = value;
    Nullstack.update();
    return Reflect.set(...arguments);
  }
}

const instanceProxyHandler = {
  get(target, name) {
    if(target.attributes && target.attributes.proxy && target.attributes.proxy[name] !== undefined && target[name] !== undefined) {
      return target.attributes.proxy[name];
    }
    if(name !== 'prepare' && name !== 'initiate' && target[name] === undefined && target.constructor[name] === true) {
      const detour = async function(params = {}) {
        const url = `/${target.constructor.hash}/${name}.json`;
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(params)
        });
        const payload = await response.text();
        return deserialize(payload).result;
      }
      target[name] = detour.bind(this);
    }
    return Reflect.get(...arguments);
  },
  set(target, name, value) {
    if(target.attributes && target.attributes.proxy && target.attributes.proxy[name] !== undefined && target[name] !== undefined) {
      target.attributes.proxy[name] = value;
    }
    const result = Reflect.set(...arguments);
    Nullstack.update();
    return result;
  }
}

export default class Nullstack {

  render() {
    return false;
  }

  static initialized = false;
  static hydrated = false;
  static initializer = null;
  
  static instances = {};
  static instancesMountedQueue = [];
  static instancesRenewedQueue = [];
  static virtualDom = {};
  static selector = null;
  static routes = {};
  static params = {};

  static renderQueue = null;

  static start(Starter) {
    for(const [key, value] of Object.entries(window.context)) {
      context[key] = value;
    }
    Object.freeze(context.project);
    delete window.context;
    this.routes = {};
    const [path, query] = router.url.split('?');
    this.params = this.getQueryStringParams(query);
    this.currentInstance = null;
    this.initializer = () => Nullstack.element(Starter);
    this.selector = document.querySelector('#application');
    this.instancesMountedQueue = [];
    this.instancesRenewedQueue = [];
    this.virtualDom = window.representation;
    this.nextVirtualDom = this.initializer();
    this.rerender(this.selector, [0], []);
    this.virtualDom = this.nextVirtualDom;
    this.nextVirtualDom = null;
    delete window.representation;
    delete window.instances;
    this.processLifecycleQueues();
  }

  static generateKey(node, depth) {
    return depth.join('.');
  }

  static generateContext(temporary) {
    const params = temporary.params ? {...temporary.params, ...this.params} : this.params;
    temporary.params = new Proxy(params, paramsProxyHandler);
    return new Proxy({...context, ...temporary}, contextProxyHandler);
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

  static findParentInstance(depth) {
    for(let i = 0; i < depth.length; i++) {
      const key = depth.slice(0, i * -1).join('.');
      if(this.instances[key]) {
        return this.instances[key];
      }
    }
  }

  static rerender(parent, depth, vdepth) {
    if(!this.hydrated) {
      for(const element of parent.childNodes) {
        if(element.tagName && element.tagName.toLowerCase() == 'textarea' && element.childNodes.length == 0) {
          element.appendChild(document.createTextNode(''));
        }
        if(element.COMMENT_NODE === 8 && element.textContent === '#') {
          parent.removeChild(element);
        }
      }
    }
    const index = depth[depth.length - 1];
    const selector = parent.childNodes[index];
    let current = this.virtualDom;
    let next = this.nextVirtualDom;
    for(const level of vdepth) {
      current = current.children[level];
      next = next.children[level];
    }
    if(this.isFalse(current) && this.isFalse(next)) {
      return;
    }
    if((this.isFalse(current) || this.isFalse(next)) && current != next) {
      const nextSelector = this.render(next, vdepth);
      return parent.replaceChild(nextSelector, selector);
    }
    if(next !== undefined && next.attributes !== undefined && next.attributes.bind) {
      const instance = this.findParentInstance([0, ...vdepth]);
      const target = next.attributes.source || instance;
      if(next.type === 'textarea') {
        next.children = [target[next.attributes.bind]];
      } else if(next.type === 'input' && next.attributes.type === 'checkbox') {
        next.attributes.checked = target[next.attributes.bind];
      } else {
        next.attributes.value = target[next.attributes.bind];
      }
      next.attributes.name = next.attributes.bind;
      let eventName = 'oninput';
      let valueName = 'value';
      if(next.attributes.type === 'checkbox' || next.attributes.type === 'radio') {
        eventName = 'onclick';
        valueName = 'checked';
      } else if(next.type !== 'input' && next.type !== 'textarea') {
        eventName = 'onchange';
      }
      const originalEvent = next.attributes[eventName];
      next.attributes[eventName] = ({event, value}) => {
        if(valueName == 'checked') {
          target[next.attributes.bind] = event.target[valueName];
        } else if(target[next.attributes.bind] === true || target[next.attributes.bind] === false) {
          target[next.attributes.bind] = event ? (event.target[valueName] == 'true') : value;
        } else if(typeof target[next.attributes.bind] === 'number') {
          target[next.attributes.bind] = parseFloat(event ? event.target[valueName] : value) || 0;
        } else {
          target[next.attributes.bind] = event ? event.target[valueName] : value;
        }
        Nullstack.update();
        if(originalEvent !== undefined) {
          setTimeout(() => {
            const context = this.generateContext({...instance.attributes, ...next.attributes, event, value});
            originalEvent(context);
          }, 0);
        }
      }
    }
    if(this.isFunction(next)) {
      const instance = this.findParentInstance([0, ...vdepth]);
      const context = this.generateContext({...instance.attributes, ...next.attributes});
      const root = next.type(context);
      next.children = [root];
      return this.rerender(parent, depth, [...vdepth, 0]);
    }
    if(current !== undefined && /^[A-Z]/.test(current.type) && typeof(next.type) === 'function' && current.type === next.type.name) {
      const key = this.generateKey(next, [0, ...vdepth]);
      const instance = new next.type();
      instance.events = {};
      this.instances[key] = instance;
      const state = window.instances[key];
      for(const attribute in state) {
        instance[attribute] = state[attribute];
      }
      this.instancesMountedQueue.push(instance);
      const context = this.generateContext(next.attributes);
      instance.prepare && instance.prepare(context);
      instance.attributes = next.attributes;
      this.instancesRenewedQueue.push(instance);
      const root = instance.render(context);
      next.children = [root];
      const limit = Math.max(current.children.length, next.children.length);
      for(let i = 0; i < limit; i++) {
        this.rerender(parent, depth, [...vdepth, i]);
      }
    } else if(this.isClass(current) && current.type === next.type) {
      const key = this.generateKey(next, [0, ...vdepth]);
      let instance = null;
      if(!this.routeChanged) {
        instance = this.instances[key];
      } else if(this.routeChanged) {
        let shouldReinitiate = false;
        if(next.attributes._segments) {
          for(const segment of next.attributes._segments) {
            if(current.attributes.params[segment] !== next.attributes.params[segment]) {
              shouldReinitiate = true;
            }
          }
          delete next.attributes._segments;
        }
        if(!shouldReinitiate) {
          instance = this.instances[key];
        }
      }
      const context = this.generateContext(next.attributes);
      if(!instance) {
        instance = new next.type();
        instance.events = {};
        this.instances[key] = instance;
        this.instancesMountedQueue.push(instance);
        instance.prepare && instance.prepare(context);
      }
      instance.attributes = next.attributes;
      this.instancesRenewedQueue.push(instance);
      const root = instance.render(context);
      next.children = [root];
      const limit = Math.max(current.children.length, next.children.length);
      for(let i = 0; i < limit; i++) {
        this.rerender(parent, depth, [...vdepth, i]);
      }
    } else if (current.type !== next.type) {
      const nextSelector = this.render(next, vdepth);
      parent.replaceChild(nextSelector, selector);
    } else if (this.isText(current) && this.isText(next)) {
      if(current != next) {
        return selector.nodeValue = next;
      }
    } else if (current.type === next.type) {
      if(next.type === 'a' && next.attributes.href && next.attributes.href.startsWith('/') && !next.attributes.target) {
        next.attributes.onclick = ({event}) => {
          event.preventDefault();
          router.url = next.attributes.href;
          context.environment.prerendered = false;
        };
      }
      const attributeNames = Object.keys({...current.attributes, ...next.attributes});
      for(const name of attributeNames) {
        if(name === 'html') {
          if(next.attributes[name] !== current.attributes[name]) {
            selector.innerHTML = next.attributes[name];
          }
          const links = selector.querySelectorAll('a[href^="/"]:not([target])');
          for(const link of links) {
            link.onclick = (event) => {
              event.preventDefault();
              router.url = link.href;
              context.environment.prerendered = false;
            };
          }
        } else if(name === 'checked') {
          if(next.attributes[name] !== selector.value) {
            selector.checked = next.attributes[name];
          }
        } else if(name === 'value') {
          if(next.attributes[name] !== selector.value) {
            selector.value = next.attributes[name];
          }
        } else if(name.startsWith('on')) {
          const eventName = name.replace('on', '');
          const key = '0.' + vdepth.join('.') + '.' + eventName;
          const instance = this.findParentInstance([0, ...vdepth]);
          selector.removeEventListener(eventName, instance.events[key]);
          if(next.attributes[name]) {
            instance.events[key] = (event) => {
              if(next.attributes.default !== true) {
                event.preventDefault();
              }
              const context = this.generateContext({...instance.attributes, ...next.attributes, event});
              next.attributes[name](context);
            };
            selector.addEventListener(eventName, instance.events[key]);
          } else {
            delete instance.events[key];
          }
        } else if(typeof(next.attributes[name]) !== 'function' && typeof(next.attributes[name]) !== 'object') {
          if(current.attributes[name] === undefined && next.attributes[name] !== undefined) {
            selector.setAttribute(name, next.attributes[name]);
          } else if(current.attributes[name] !== undefined && next.attributes[name] === undefined) {
            selector.removeAttribute(name);
          } else if(current.attributes[name] !== next.attributes[name]) {
            if(name != 'value' && next.attributes[name] === false || next.attributes[name] === null || next.attributes[name] === undefined) {
              selector.removeAttribute(name);
            } else if(name != 'value' && next.attributes[name] === true) {
              selector.setAttribute(name, name);
            } else {
              selector.setAttribute(name, next.attributes[name]);
            }
          }
        }
      }
      if(next.attributes.html) return;
      const limit = Math.max(current.children.length, next.children.length);
      const routeDepth = depth.join('.');
      for(const child of next.children) {
        if(this.isRoutable(child)) {
          if(this.routes[routeDepth] !== undefined) {
            child.type = false;
            child.children = [];
          } else {
            const params = this.routeMatches(router.url, child.attributes.route);
            if(params) {
              this.routes[routeDepth] = true;
              child.attributes.params = params;
            } else {
              child.type = false;
              child.children = [];
            }
          }
          child.attributes._segments = child.attributes.route.split('/').filter((segment) => {
            return segment[0] == ':';
          }).map((segment) => {
            return segment.slice(1);
          });
          delete child.attributes.route;
        }
      }
      if(next.children.length > current.children.length) {
        for(let i = 0; i < current.children.length; i++) {
          this.rerender(selector, [...depth, i], [...vdepth, i]);
        }
        for(let i = current.children.length; i < next.children.length; i++) {
          const nextSelector = this.render(next.children[i], [...vdepth, i]);
          selector.appendChild(nextSelector);
        }
      } else if(current.children.length > next.children.length) {
        for(let i = 0; i < next.children.length; i++) {
          this.rerender(selector, [...depth, i], [...vdepth, i]);
        }
        for(let i = current.children.length - 1; i >= next.children.length; i--) {
          selector.removeChild(selector.childNodes[i]);          
        }
      } else {
        for(let i = limit - 1; i > -1; i--) {
          this.rerender(selector, [...depth, i], [...vdepth, i]);
        }
      }
      if(next.type == 'textarea') {
        selector.value = next.children.join("");
      }
      if(next.type == 'select') {
        selector.value = next.attributes.value;
      }
    }
  }

  routeChanged = false;

  static update() {
    if(this.initialized) {
      clearInterval(this.renderQueue);
      this.renderQueue = setTimeout(() => {
        const [path, query] = router.url.split('?');
        this.params = this.getQueryStringParams(query);
        this.initialized = false;
        this.routes = {};
        this.instancesMountedQueue = [];
        this.instancesRenewedQueue = [];
        this.nextVirtualDom = this.initializer();
        this.rerender(this.selector, [0], []);
        this.virtualDom = this.nextVirtualDom;
        this.nextVirtualDom = null;
        this.processLifecycleQueues();
      }, 16);
    }
  }

  static async processLifecycleQueues() {
    if(!this.initialized) {
      this.initialized = true;
      this.hydrated = true;
    }
    for(const instance of this.instancesMountedQueue) {
      const context = this.generateContext(instance.attributes);
      instance.initiate && await instance.initiate(context);
    }
    for(const [id, instance] of Object.entries(this.instances)) {
      if(!this.instancesRenewedQueue.includes(instance)) {
        const context = this.generateContext(instance.attributes);
        instance.terminate && await instance.terminate(context);
        delete this.instances[id];
      }
    }
    this.routeChanged = false;
  }

  constructor() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    const proxy = new Proxy(this, instanceProxyHandler);
    for(const method of methods) {
      if(method !== 'constructor' && typeof(this[method]) === 'function') {
        this[method] = this[method].bind(proxy);
      }
    }
    return proxy;
  }

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
      return {type, attributes, children: []}
    }
    return {type, attributes, children};
  }

  static isFalse(node) {
    return (node === false || node.type === false);
  }

  static isBlank(node) {
    return (node === null || node === undefined);
  }

  static isRoutable(node) {
    return (node && node.attributes !== undefined && node.attributes.route !== undefined);
  }

  static isClass(node) {
    return typeof(node.type) === 'function' && typeof(node.type.prototype.render === 'function');
  }

  static isFunction(node) {
    return typeof(node.type) === 'function' && node.type.prototype === undefined;
  }

  static isText(node) {
    return node !== 'Fragment' && typeof(node.children) === 'undefined';
  }

  static render(node, depth) {
    if(this.isRoutable(node)) {
      const routeDepth = depth.slice(0,-1).join('.');
      if(this.routes[routeDepth] !== undefined) {
        node.type = false;
        node.children = [];
      }
      const params = this.routeMatches(router.url, node.attributes.route);
      if(params) {
        this.routes[routeDepth] = true;
        node.attributes.params = params;
      } else {
        node.type = false;
        node.children = [];
      }
    }
    if(this.isFalse(node)) {
      return document.createComment("");
    }
    if(node != undefined && node.attributes != undefined && node.attributes.bind) {
      const instance = this.findParentInstance([0, ...depth]);
      const target = node.attributes.source || instance;
      if(node.type === 'textarea') {
        node.children = [target[node.attributes.bind]];
      } else {
        node.attributes.value = target[node.attributes.bind];
      }
      node.attributes.name = node.attributes.bind;
      let eventName = 'oninput';
      let valueName = 'value';
      if(node.attributes.type === 'checkbox' || node.attributes.type === 'radio') {
        eventName = 'onclick';
        valueName = 'checked';
      } else if(node.type !== 'input' && node.type !== 'textarea') {
        eventName = 'onchange';
      }
      const originalEvent = node.attributes[eventName];
      node.attributes[eventName] = ({event, value}) => {
        if(valueName == 'checked') {
          target[node.attributes.bind] = event.target[valueName];
        } else if(target[node.attributes.bind] === true || target[node.attributes.bind] === false) {
          target[node.attributes.bind] = event ? (event.target[valueName] == 'true') : value;
        } else if(typeof target[node.attributes.bind] === 'number') {
          target[node.attributes.bind] = parseFloat(event ? event.target[valueName] : value) || 0;
        } else {
          target[node.attributes.bind] = event ? event.target[valueName] : value;
        }
        Nullstack.update();
        if(originalEvent !== undefined) {
          setTimeout(() => {
            const context = this.generateContext({...instance.attributes, ...node.attributes, event, value});
            originalEvent(context);
          }, 0);
        }
      }
    }
    if(this.isFunction(node)) {
      const instance = this.findParentInstance([0, ...depth]);
      const context = this.generateContext({...instance.attributes, ...node.attributes});
      const root = node.type(context);
      node.children = [root];
      return this.render(node.children[0], [...depth, 0]);
    }
    if(this.isClass(node)) {
      const key = this.generateKey(node, [0, ...depth]);
      const instance = new node.type();
      instance.events = {};
      instance.attributes = node.attributes;
      this.instances[key] = instance;
      const context = this.generateContext(node.attributes);
      instance.prepare && instance.prepare(context);
      const root = instance.render(context);
      node.children = [root];
      this.instancesMountedQueue.push(instance);
      this.instancesRenewedQueue.push(instance);
      return this.render(node.children[0], [...depth, 0]);
    }
    if(this.isText(node)) {
      return document.createTextNode(node);
    }
    let element;
    let next = this.nextVirtualDom;
    let isSvg = false;
    for(const level of depth) {
      next = next.children[level];
      if(!next) break;
      if(next.type === 'svg') {
        isSvg = true;
        break;
      }
    }
    if(isSvg) {
      element = document.createElementNS("http://www.w3.org/2000/svg", node.type);
    } else {
      element = document.createElement(node.type);
    }
    if(node.type === 'a' && node.attributes.href && node.attributes.href.startsWith('/') && !node.attributes.target) {
      node.attributes.onclick = ({event}) => {
        event.preventDefault();
        router.url = node.attributes.href;
        context.environment.prerendered = false;
      };
    }
    for(let name in node.attributes) {
      if(name === 'html') {
        element.innerHTML = node.attributes[name];
        const links = element.querySelectorAll('a[href^="/"]:not([target])');
        for(const link of links) {
          link.onclick = (event) => {
            event.preventDefault();
            router.url = link.href;
            context.environment.prerendered = false;
          };
        }
      } else if(name.startsWith('on')) {
        const eventName = name.replace('on', '');
        const key = '0.' + depth.join('.') + '.' + eventName;
        const instance = this.findParentInstance([0, ...depth]);
        instance.events[key] = (event) => {
          if(node.attributes.default !== true) {
            event.preventDefault();
          }
          const context = this.generateContext({...instance.attributes, ...node.attributes, event});
          node.attributes[name](context);
        };
        element.addEventListener(eventName, instance.events[key]);
      } else if(typeof(node.attributes[name]) !== 'function' && typeof(node.attributes[name]) !== 'object') {
        if(name != 'value' && node.attributes[name] === true) {
          element.setAttribute(name, name);
        } else if(name == 'value' || (node.attributes[name] !== false && node.attributes[name] !== null && node.attributes[name] !== undefined)) {
          element.setAttribute(name, node.attributes[name]);
        }
      }
    }
    if(!node.attributes.html) {
      for(let i = 0; i < node.children.length; i++) {
        const dom = this.render(node.children[i], [...depth, i]);
        element.appendChild(dom);
      }
      if(node.type == 'select') {
        element.value = node.attributes.value;
      }
    }
    return element;
  }

}