import {existsSync, readFileSync} from 'fs';
import path from 'path';
import environment from './environment';
import project from './project';
import settings from './settings';

import staticHelpers from '!!raw-loader!../workers/staticHelpers.js';
import staticInstall from '!!raw-loader!../workers/staticInstall.js';
import staticFetch from '!!raw-loader!../workers/staticFetch.js';

import activate from '!!raw-loader!../workers/activate.js';
import push from '!!raw-loader!../workers/push.js';

const worker = {};

worker.enabled = environment.production;
worker.fetching = false;
worker.preload = [];

export function generateServiceWorker() {
  const sources = [];
  const context = {environment, project, settings, worker};
  let original = '';
  const file = path.join(__dirname, '../', 'public', 'service-worker.js');
  if(existsSync(file)) {
    original = readFileSync(file);
  }
  sources.push(`self.context = ${JSON.stringify(context, null, 2)};`);
  if(environment.static) {
    sources.push(staticHelpers);
  }
  if(environment.static && original.indexOf('install') === -1) {
    sources.push(staticInstall);
  }
  if(original.indexOf('activate') === -1) {
    sources.push(activate);
  }
  if(original.indexOf('push') === -1) {
    sources.push(push);
  }
  if(environment.static && original.indexOf('fetch') === -1) {
    sources.push(staticFetch);
  }
  if(original) {
    sources.push(original);
  }
  return sources.join(`\n\n`);
}

export default worker;