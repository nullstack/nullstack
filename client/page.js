import client from './client';

const pageProxyHandler = {
  set(target, name, value) {
    if(name === 'title') {
      document.title = value;
    }
    const result = Reflect.set(...arguments);
    client.update();
    return result;
  }
}

const page = new Proxy({...window.page}, pageProxyHandler);

delete window.page;

export default page;