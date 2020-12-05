import client from './client';
import windowEvent from './windowEvent';

const pageProxyHandler = {
  set(target, name, value) {
    if(name === 'title') {
      document.title = value;
    }
    const result = Reflect.set(...arguments);
    if(name === 'title') {
      windowEvent('page.title');
    }
    client.update();
    return result;
  }
}

const page = new Proxy({...window.page}, pageProxyHandler);

delete window.page;

export default page;