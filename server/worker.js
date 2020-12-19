import {existsSync, readFileSync} from 'fs';
import path from 'path';
import environment from './environment';
import project from './project';
import settings from './settings';

import load from '!!raw-loader!../workers/load.js';
import cacheFirst from '!!raw-loader!../workers/cacheFirst.js';
import networkDataFirst from '!!raw-loader!../workers/networkDataFirst.js';
import networkFirst from '!!raw-loader!../workers/networkFirst.js';
import networkOnly from '!!raw-loader!../workers/networkOnly.js';
import staleWhileRevalidate from '!!raw-loader!../workers/staleWhileRevalidate.js';

import staticHelpers from '!!raw-loader!../workers/staticHelpers.js';
import staticInstall from '!!raw-loader!../workers/staticInstall.js';
import staticFetch from '!!raw-loader!../workers/staticFetch.js';

import dynamicInstall from '!!raw-loader!../workers/dynamicInstall.js';
import dynamicFetch from '!!raw-loader!../workers/dynamicFetch.js';

import activate from '!!raw-loader!../workers/activate.js';

const worker = {};

worker.enabled = environment.production;
worker.fetching = false;
worker.preload = [];
worker.headers = {};

export function generateServiceWorker() {
  const sources = [];
  const context = {environment, project, settings, worker};
  let original = '';
  const file = path.join(__dirname, '../', 'public', 'service-worker.js');
  if(existsSync(file)) {
    original = readFileSync(file, 'utf-8');
  }
  sources.push(`self.context = ${JSON.stringify(context, null, 2)};`);
  sources.push(load);
  if(environment.static) {
    sources.push(staticHelpers);
    sources.push(cacheFirst);
    sources.push(staleWhileRevalidate);
    sources.push(networkFirst);
    sources.push(networkDataFirst);
  } else {
    sources.push(cacheFirst);
    sources.push(staleWhileRevalidate);
    sources.push(networkOnly);
  }
  if(original.indexOf('install') === -1) {
    sources.push(environment.static ? staticInstall : dynamicInstall);
  }
  if(original.indexOf('activate') === -1) {
    sources.push(activate);
  }
  if(original.indexOf('fetch') === -1) {
    sources.push(environment.static ? staticFetch : dynamicFetch);
  }
  if(original) {
    sources.push(original);
  }
  return sources.join(`\n\n`);
}

export default worker;