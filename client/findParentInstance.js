import client from './client';

export default function findParentInstance(depth) {
  for(let i = 0; i < depth.length; i++) {
    const key = depth.slice(0, i * -1).join('.');
    if(client.instances[key]) {
      return client.instances[key];
    }
  }
}