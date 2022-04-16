import client from './client';
import windowEvent from './windowEvent';
import state from './state';

const page = {
  ...state.page,
  event: 'nullstack.page'
}

delete state.page;

const pageProxyHandler = {
  set(target, name, value) {
    if (name === 'title') {
      document.title = value;
    }
    const result = Reflect.set(...arguments);
    if (name === 'title') {
      windowEvent('page');
    }
    client.update();
    return result;
  }
}

const proxy = new Proxy(page, pageProxyHandler);

export default proxy;